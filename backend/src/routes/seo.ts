import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();
const schema = z.object({
  pageKey: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.string().optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const entries = await prisma.seoEntry.findMany();
    res.json(entries);
  } catch (err) { next(err); }
});

router.get("/:pageKey", async (req, res, next) => {
  try {
    const entry = await prisma.seoEntry.findUnique({ where: { pageKey: req.params.pageKey } });
    res.json(entry || null);
  } catch (err) { next(err); }
});

router.put("/:pageKey", requireAuth, async (req, res, next) => {
  try {
    const data = schema.omit({ pageKey: true }).parse(req.body);
    const entry = await prisma.seoEntry.upsert({
      where: { pageKey: req.params.pageKey },
      update: data,
      create: { pageKey: req.params.pageKey, ...data },
    });
    res.json(entry);
  } catch (err) { next(err); }
});

export default router;
