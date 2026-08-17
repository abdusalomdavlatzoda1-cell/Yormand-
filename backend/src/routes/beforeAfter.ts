import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const schema = z.object({
  beforeImage: z.string().min(1),
  afterImage: z.string().min(1),
  treatmentName: z.string().min(1),
  description: z.string().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === "true" ? {} : { published: true };
    const items = await prisma.beforeAfter.findMany({ where, orderBy: { order: "asc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const item = await prisma.beforeAfter.create({ data });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const item = await prisma.beforeAfter.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.beforeAfter.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
