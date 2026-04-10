import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";
import routes from "./routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return cb(null, true);
    if (allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: false, crossOriginOpenerPolicy: false }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));

app.use("/api", routes);
app.get("/health", (_req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

const PORT = parseInt(process.env.PORT || "5001", 10);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
}).catch((err) => {
  console.error("DB connection failed:", err);
  process.exit(1);
});
