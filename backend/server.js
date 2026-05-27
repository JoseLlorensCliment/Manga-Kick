import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import playersRouter from "./routes/players.js";
import matchRouter from "./routes/simulator.js";
import trainingRouter from "./routes/training.js";
import { loadAllImages } from "./imageLoader.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/players", playersRouter);
app.use("/api/match", matchRouter);
app.use("/api/training", trainingRouter);

// Health-check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 MangaKick backend running on http://localhost:${PORT}`);
  // Start loading images in the background
  loadAllImages().catch(err => console.error("Error loading images:", err));
});
