import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const schema = z.object({
  reviewerName: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(1),
  source: z.string().optional(),
  approved: z.boolean().optional(),
  order: z.number().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === "true" ? {} : { approved: true };
    const items = await prisma.review.findMany({ where, orderBy: { order: "asc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const item = await prisma.review.create({ data });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const item = await prisma.review.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
