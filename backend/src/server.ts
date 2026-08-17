import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";

import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import doctorRoutes from "./routes/doctors";
import galleryRoutes from "./routes/gallery";
import beforeAfterRoutes from "./routes/beforeAfter";
import reviewRoutes from "./routes/reviews";
import priceRoutes from "./routes/prices";
import appointmentRoutes from "./routes/appointments";
import settingsRoutes from "./routes/settings";
import socialRoutes from "./routes/social";
import seoRoutes from "./routes/seo";
import homepageRoutes from "./routes/homepage";
import mediaRoutes from "./routes/media";

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Global rate limit as a baseline defense
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), process.env.UPLOAD_PATH || "./uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/before-after", beforeAfterRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/media", mediaRoutes);
// Serve the built frontend (single-domain deployment)
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  res.sendFile(path.join(frontendDist, "index.html"));
});
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Yormand API running on http://localhost:${PORT}`);
});
