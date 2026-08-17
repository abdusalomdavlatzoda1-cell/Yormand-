import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const schema = z.object({
  imageUrl: z.string().min(1),
  category: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const { all, category } = req.query;
    const where: any = all === "true" ? {} : { visible: true };
    if (category) where.category = category;
    const items = await prisma.galleryItem.findMany({ where, orderBy: { order: "asc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const item = await prisma.galleryItem.create({ data });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const item = await prisma.galleryItem.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
