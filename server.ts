import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import blogRoutes from "./server/routes/blogRoutes";
import adminRoutes from "./server/routes/adminRoutes";
import uploadRoutes from "./server/routes/uploadRoutes";
import commentRoutes from "./server/routes/commentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- DATABASE CONNECTION ---------------- */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI as string;

    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* ---------------- API ROUTES ---------------- */

app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/comments", commentRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/api/health", async (req, res) => {
  await connectDB();
  res.json({ status: "ok", database: "connected" });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* ---------------- STATIC FRONTEND ---------------- */

app.use(express.static(path.join(process.cwd(), "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

export default app;
