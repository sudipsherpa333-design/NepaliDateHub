import express from "express";
import { AdminUser } from "../models/AdminUser";

const router = express.Router();

// Initialize admin user if it doesn't exist
export const initializeAdmin = async () => {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const admin = new AdminUser({
        username: "admin",
        password: "admin9813@#$", // In a real app, this should be hashed using bcrypt
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

    // In a real app, generate and return a JWT token here
    res.json({ message: "Login successful", success: true });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export default router;
