import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import blogRoutes from "./server/routes/blogRoutes";
import adminRoutes, { initializeAdmin } from "./server/routes/adminRoutes";
import uploadRoutes from "./server/routes/uploadRoutes";
import commentRoutes from "./server/routes/commentRoutes";

import { fileURLToPath } from "url";
import { connectDB } from "./server/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sudipsherpa333_db_user:IlIuFNAyO5jKq36S@calc.z8ggqua.mongodb.net/calc?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env or Vercel");
}

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploaded images statically
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
app.use("/uploads", express.static(isVercel ? "/tmp/uploads" : path.join(process.cwd(), "uploads")));

// Establish database connection on startup
connectDB().then(() => {
  initializeAdmin();
}).catch(console.error);

// API Routes
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler caught:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.get("/api/db-status", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
      99: "uninitialized",
    };
    res.json({ 
      status: states[state as keyof typeof states] || "unknown",
      uri: MONGODB_URI.replace(/:([^:@]{3,})@/, ':***@') // Hide password in response
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Setup Vite or Static serving
if (process.env.NODE_ENV !== "production") {
  async function setupVite() {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  setupVite();
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Only listen if not running in Vercel (Vercel uses serverless functions)
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
