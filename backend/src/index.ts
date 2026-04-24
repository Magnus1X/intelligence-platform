import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";

const app = express();

// ── CORS — manual implementation for Express 5 compatibility ───────────────
// This runs on EVERY request and adds CORS headers to all responses.
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Short-circuit preflight requests immediately
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

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
