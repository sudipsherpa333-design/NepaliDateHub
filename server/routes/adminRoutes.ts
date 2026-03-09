import express from "express";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/AdminUser.js";
import { connectDB } from "../db.js";

const router = express.Router();

// Initialize admin user if it doesn't exist
export const initializeAdmin = async () => {
  try {
    await connectDB();
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        console.warn("ADMIN_USERNAME or ADMIN_PASSWORD not set in environment variables. Skipping admin initialization.");
        return;
      }

      const admin = new AdminUser({
        username: adminUsername,
        password: adminPassword, // In a real app, this should be hashed using bcrypt
      });
      await admin.save();
      console.log("Admin user initialized in database from environment variables");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

// Admin login route
router.post("/login", async (req, res) => {
  try {
    await connectDB();
    await initializeAdmin(); // Ensure admin exists before login
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

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
