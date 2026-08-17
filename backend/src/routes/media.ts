import { Router } from "express";
import fs from "fs";
import path from "path";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();
const UPLOAD_PATH = process.env.UPLOAD_PATH || "./uploads";

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { uploadedAt: "desc" } });
    res.json(media);
  } catch (err) { next(err); }
});

router.post("/upload", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    const media = await prisma.media.create({
      data: {
        url,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
    res.status(201).json(media);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (media) {
      const filePath = path.join(UPLOAD_PATH, path.basename(media.url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await prisma.media.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
