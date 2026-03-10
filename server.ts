import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import blogRoutes from "./server/routes/blogRoutes.js";
import adminRoutes, { initializeAdmin } from "./server/routes/adminRoutes.js";
import uploadRoutes from "./server/routes/uploadRoutes.js";
import commentRoutes from "./server/routes/commentRoutes.js";

import { fileURLToPath } from "url";
import { connectDB } from "./server/db.js";
import { AdminUser } from "./server/models/AdminUser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || process.env.mongodb_MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MongoDB URI is missing! Check your Vercel Env Variables.");
}

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/db-status", async (req, res) => {
  try {
    // Attempt to connect to the database to get a true runtime status
    await connectDB();
    
    // Perform a simple operation to verify read access and authentication
    const adminCount = await AdminUser.countDocuments();
    
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
      message: "🚀 MongoDB Connected Successfully!",
      adminCount: adminCount,
      uri: MONGODB_URI ? MONGODB_URI.replace(/:([^:@]{3,})@/, ':***@') : "Not Set"
    });
  } catch (error: any) {
    console.error("❌ Database Status Check Failed:", error);
    
    let userFriendlyMessage = "❌ MongoDB Connection Error";
    let actionRequired = "Check your database connection string and network settings.";
    
    // Check for specific MongoDB authentication errors
    if (error.message && error.message.includes("bad auth")) {
      userFriendlyMessage = "❌ MongoDB Authentication Failed";
      actionRequired = "The username or password in your MONGODB_URI is incorrect. Please update it in your Vercel Environment Variables.";
    } else if (error.message && error.message.includes("ENOTFOUND")) {
      userFriendlyMessage = "❌ MongoDB Host Not Found";
      actionRequired = "The database hostname in your MONGODB_URI is incorrect or unreachable.";
    } else if (error.message && error.message.includes("IP")) {
      userFriendlyMessage = "❌ MongoDB IP Blocked";
      actionRequired = "Make sure you have added 0.0.0.0/0 to your Network Access in MongoDB Atlas.";
    }

    res.status(500).json({ 
      status: "error", 
      message: userFriendlyMessage,
      actionRequired: actionRequired,
      details: error.message,
      uri: MONGODB_URI ? MONGODB_URI.replace(/:([^:@]{3,})@/, ':***@') : "Not Set"
    });
  }
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler caught:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Setup Vite or Static serving
if (process.env.NODE_ENV !== "production") {
  async function setupVite() {
    const { createServer: createViteServer } = await import("vite");
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
