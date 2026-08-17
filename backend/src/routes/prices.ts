import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const schema = z.object({
  serviceId: z.string().nullable().optional(),
  label: z.string().min(1),
  price: z.number().nullable().optional(),
  currency: z.string().optional(),
  priceRange: z.string().optional(),
  onConsultation: z.boolean().optional(),
  visible: z.boolean().optional(),
  order: z.number().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const { all } = req.query;
    const where = all === "true" ? {} : { visible: true };
    const items = await prisma.price.findMany({ where, orderBy: { order: "asc" }, include: { service: true } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const item = await prisma.price.create({ data });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const item = await prisma.price.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.price.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
