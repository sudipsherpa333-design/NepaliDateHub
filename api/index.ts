// api/index.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import app, { connectDB } from "../server/server"; // 🔹 Point directly to server.ts

// Connect to MongoDB once per serverless instance
connectDB().catch((err) => console.error("MongoDB connection failed:", err));

// Export serverless handler
export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any); // Vercel expects handler signature
};
