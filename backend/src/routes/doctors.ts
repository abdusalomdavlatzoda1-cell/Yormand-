import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const translationSchema = z.object({
  locale: z.enum(["tj", "ru", "en"]),
  fullName: z.string().min(1),
  specialization: z.string().optional(),
  biography: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
});

const doctorSchema = z.object({
  slug: z.string().min(1),
  photo: z.string().optional(),
  isPlaceholder: z.boolean().optional(),
  experience: z.string().optional(),
  languages: z.string().optional(),
  socialLinks: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
  translations: z.array(translationSchema).min(1),
});

router.get("/", async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === "true" ? {} : { active: true };
    const doctors = await prisma.doctor.findMany({
      where,
      include: { translations: true },
      orderBy: { order: "asc" },
    });
    res.json(doctors);
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { slug: req.params.slug },
      include: { translations: true },
    });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = doctorSchema.parse(req.body);
    const doctor = await prisma.doctor.create({
      data: {
        slug: data.slug,
        photo: data.photo,
        isPlaceholder: data.isPlaceholder ?? false,
        experience: data.experience,
        languages: data.languages,
        socialLinks: data.socialLinks,
        order: data.order ?? 0,
        active: data.active ?? true,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
    res.status(201).json(doctor);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = doctorSchema.partial({ translations: true as any }).parse(req.body);
    const { translations, ...rest } = data as any;

    const doctor = await prisma.doctor.update({ where: { id: req.params.id }, data: rest });

    if (translations) {
      for (const t of translations) {
        await prisma.doctorTranslation.upsert({
          where: { doctorId_locale: { doctorId: doctor.id, locale: t.locale } },
          update: t,
          create: { ...t, doctorId: doctor.id },
        });
      }
    }

    const updated = await prisma.doctor.findUnique({
      where: { id: doctor.id },
      include: { translations: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.doctor.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
