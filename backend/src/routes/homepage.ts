import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();
const schema = z.object({
  key: z.string().min(1),
  visible: z.boolean().optional(),
  order: z.number().optional(),
  dataJson: z.string().optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const sections = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });
    res.json(sections);
  } catch (err) { next(err); }
});

router.put("/:key", requireAuth, async (req, res, next) => {
  try {
    const data = schema.omit({ key: true }).parse(req.body);
    const section = await prisma.homepageSection.upsert({
      where: { key: req.params.key },
      update: data,
      create: { key: req.params.key, ...data },
    });
    res.json(section);
  } catch (err) { next(err); }
});

export default router;
