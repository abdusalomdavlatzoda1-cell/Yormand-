import { Router } from "express";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: "settings" } });
    res.json(settings ? JSON.parse(settings.data) : {});
  } catch (err) { next(err); }
});

router.put("/", requireAuth, async (req, res, next) => {
  try {
    const data = JSON.stringify(req.body);
    const settings = await prisma.siteSetting.upsert({
      where: { id: "settings" },
      update: { data },
      create: { id: "settings", data },
    });
    res.json(JSON.parse(settings.data));
  } catch (err) { next(err); }
});

export default router;
