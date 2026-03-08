// server/server.ts
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import blogRoutes from "./routes/blogRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Serverless-friendly MongoDB Connection ---
declare global {
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI environment variable not set");

    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((conn) => {
        cached.conn = conn;
        console.log("MongoDB connected");
        return conn;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// --- API Routes ---
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/comments", commentRoutes);

// --- Health Check ---
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// --- Static Frontend ---
app.use(express.static(path.join(process.cwd(), "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// --- Error Handler ---
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
