import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import prisma from "../config/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please try again later." },
});

const createSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(5).max(30),
  serviceName: z.string().max(150).optional(),
  preferredDate: z.string().max(30).optional(),
  preferredTime: z.string().max(30).optional(),
  message: z.string().max(1000).optional(),
});

// PUBLIC: submit appointment request
router.post("/", publicLimiter, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const appointment = await prisma.appointment.create({ data });
    res.status(201).json({ success: true, id: appointment.id });
  } catch (err) { next(err); }
});

// ADMIN: list with filter/search/sort
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { status, search, sort = "createdAt", order = "desc" } = req.query as Record<string, string>;
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { [sort]: order === "asc" ? "asc" : "desc" },
    });
    res.json(appointments);
  } catch (err) { next(err); }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
    if (!appointment) return res.status(404).json({ error: "Not found" });
    res.json(appointment);
  } catch (err) { next(err); }
});

const updateSchema = z.object({
  status: z.enum(["NEW", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  internalNote: z.string().max(2000).optional(),
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const appointment = await prisma.appointment.update({ where: { id: req.params.id }, data });
    res.json(appointment);
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
