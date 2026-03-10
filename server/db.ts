import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.mongodb_MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MongoDB URI is missing! Check your Vercel Env Variables.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("🚀 MongoDB Connected Successfully!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error: any) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }

  return cached.conn;
}
