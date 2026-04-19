import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";

const app = express();

// ── CORS — fully open, reflect any origin ──────────────────────────────────
app.use(cors({ origin: true, credentials: true, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.options("*", cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false, crossOriginOpenerPolicy: false }));
app.use(morgan("combined"));
app.use(express.json({ limit: "2mb" }));

// ── Health (before routes so it always works) ──────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// ── Routes — lazy load so a crash here doesn't kill the server ─────────────
try {
  const routes = require("./routes").default;
  app.use("/api", routes);
  console.log("Routes loaded successfully");
} catch (err: any) {
  console.error("ROUTES FAILED TO LOAD:", err.message);
  app.use("/api", (_req: Request, res: Response) => {
    res.status(503).json({ success: false, message: "Service unavailable: " + err.message });
  });
}

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = parseInt(process.env.PORT || "5001", 10);

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err: Error) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
