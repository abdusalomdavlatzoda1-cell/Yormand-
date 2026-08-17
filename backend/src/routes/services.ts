import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const translationSchema = z.object({
  locale: z.enum(["tj", "ru", "en"]),
  title: z.string().min(1),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
});

const serviceSchema = z.object({
  slug: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().optional(),
  image: z.string().optional(),
  price: z.number().nullable().optional(),
  priceVisible: z.boolean().optional(),
  duration: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  translations: z.array(translationSchema).min(1),
});

// PUBLIC: list active services (optionally filter by category)
router.get("/", async (req, res, next) => {
  try {
    const { category, all } = req.query;
    const where: any = all === "true" ? {} : { active: true };
    if (category) where.category = category;
    const services = await prisma.service.findMany({
      where,
      include: { translations: true },
      orderBy: { order: "asc" },
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
      include: { translations: true },
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
});

// ADMIN: create
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.create({
      data: {
        slug: data.slug,
        category: data.category,
        icon: data.icon,
        image: data.image,
        price: data.price ?? null,
        priceVisible: data.priceVisible ?? false,
        duration: data.duration,
        featured: data.featured ?? false,
        active: data.active ?? true,
        order: data.order ?? 0,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
});

// ADMIN: update
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = serviceSchema.partial({ translations: true as any }).parse(req.body);
    const { translations, ...rest } = data as any;

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: rest,
    });

    if (translations) {
      for (const t of translations) {
        await prisma.serviceTranslation.upsert({
          where: { serviceId_locale: { serviceId: service.id, locale: t.locale } },
          update: t,
          create: { ...t, serviceId: service.id },
        });
      }
    }

    const updated = await prisma.service.findUnique({
      where: { id: service.id },
      include: { translations: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ADMIN: delete
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
