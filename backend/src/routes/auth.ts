import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import prisma from "../config/prisma";
import { comparePassword, signToken } from "../utils/auth";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !admin.active) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await comparePassword(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken({ id: admin.id, email: admin.email, role: admin.role });
    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.id } });
    if (!admin) return res.status(404).json({ error: "Not found" });
    res.json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
  } catch (err) {
    next(err);
  }
});

export default router;
