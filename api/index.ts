// api/index.ts
import app, { connectDB } from "../server";

// Connect to MongoDB once per serverless instance
connectDB().catch((err) => console.error("MongoDB connection failed:", err));

// Export serverless handler
export default (req: any, res: any) => {
  app(req, res);
};
