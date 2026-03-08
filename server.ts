import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import blogRoutes from "./server/routes/blogRoutes";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sudipsherpa333_db_user:IlIuFNAyO5jKq36S@calc.z8ggqua.mongodb.net/calc?retryWrites=true&w=majority";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serverless-friendly MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Ensure DB connection on every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use("/api/blog", blogRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
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
}

// Only listen if not running in Vercel (Vercel uses serverless functions)
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
