import express from "express";
import { AdminUser } from "../models/AdminUser";
import { connectDB } from "../db";

const router = express.Router();

// Initialize admin user if it doesn't exist
export const initializeAdmin = async () => {
  try {
    await connectDB();
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const admin = new AdminUser({
        username: "admin",
        password: "admin9813@#$", // for production, hash using bcrypt
      });
      await admin.save();
      console.log("Admin user initialized in database");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

// Admin login route
router.post("/login", async (req, res) => {
  try {
    await connectDB(); // ensures DB is ready

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const admin = await AdminUser.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // For now, return a success message; can add JWT here later
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error: any) {
    console.error("Login error:", error);

    // Always return JSON to avoid frontend parse errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
