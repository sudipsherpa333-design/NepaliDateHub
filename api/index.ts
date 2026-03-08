// api/index.ts
import app, { connectDB } from "../server";

// Ensure DB connection
connectDB().catch(console.error);

export default (req: any, res: any) => {
  app(req, res);
};
