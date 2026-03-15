import express from "express";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/AdminUser.js";
import { connectDB } from "../db.js";

const router = express.Router();

// Initialize admin user if it doesn't exist
export const initializeAdmin = async () => {
  try {
    await connectDB();
    
    // 1. Initialize the fixed admin user requested by the user
    const fixedAdminUsername = "sudip9813";
    const fixedAdminPassword = "sudip9813@#$"; // Defaulting to no-space version in DB
    
    try {
      await AdminUser.updateOne(
        { username: fixedAdminUsername },
        { $setOnInsert: { username: fixedAdminUsername, password: fixedAdminPassword } },
        { upsert: true }
      );
    } catch (err: any) {
      // Ignore duplicate key errors caused by concurrent initialization
      if (err.code !== 11000) {
        console.error("Error initializing fixed admin user:", err);
      }
    }

    // 2. Initialize admin from environment variables (if provided)
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminUsername && adminPassword) {
      try {
        await AdminUser.updateOne(
          { username: adminUsername },
          { $setOnInsert: { username: adminUsername, password: adminPassword } },
          { upsert: true }
        );
      } catch (err: any) {
        // Ignore duplicate key errors caused by concurrent initialization
        if (err.code !== 11000) {
          console.error("Error initializing env admin user:", err);
        }
      }
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // Fixed Admin Login Bypass (Moved ABOVE database connection so it works even if MongoDB fails)
    if (cleanUsername === "sudip9813" && (cleanPassword === "sudip9813@ #$" || cleanPassword === "sudip9813@#$")) {
      const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_development_only";
      const token = jwt.sign({ id: "fixed-admin-id", username: "sudip9813" }, jwtSecret, { expiresIn: "1d" });
      return res.json({ message: "Login successful", success: true, token });
    }

    await connectDB();
    await initializeAdmin(); // Ensure admin exists before login

    const admin = await AdminUser.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // In a real app, use bcrypt.compare
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_for_development_only";
    const token = jwt.sign({ id: admin._id, username: admin.username }, jwtSecret, { expiresIn: "1d" });

    res.json({ message: "Login successful", success: true, token });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export default router;
