// api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import app, { connectDB } from "../server";

// Ensure DB connects once per serverless function instance
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
});

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
