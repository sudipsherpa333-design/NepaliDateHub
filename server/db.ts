// server/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://sudipsherpa333_db_user:IlIuFNAyO5jKq36S@calc.z8ggqua.mongodb.net/calchub?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env or Vercel"
  );
}

// Global is used to cache the connection across hot reloads in serverless
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
    const opts = { bufferCommands: false };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((conn) => {
      console.log("Connected to MongoDB");
      cached.conn = conn;
      return conn;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
