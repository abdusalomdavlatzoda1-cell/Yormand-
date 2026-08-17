import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();
const schema = z.object({
  platform: z.string().min(1),
  url: z.string().min(1),
  visible: z.boolean().optional(),
  order: z.number().optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    res.json(links);
  } catch (err) { next(err); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const link = await prisma.socialLink.create({ data });
    res.status(201).json(link);
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = schema.partial().parse(req.body);
    const link = await prisma.socialLink.update({ where: { id: req.params.id }, data });
    res.json(link);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.socialLink.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
