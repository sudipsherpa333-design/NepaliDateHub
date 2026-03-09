import express from "express";
import { Comment } from "../models/Comment.js";
import { connectDB } from "../db.js";

const router = express.Router();

// Create a new comment (defaults to pending)
router.post("/", async (req, res) => {
  try {
    await connectDB();
    const { postId, authorName, content } = req.body;
    
    if (!postId || !authorName || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const comment = new Comment({
      postId,
      authorName,
      content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error: any) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment", error: error.message });
  }
});

// Get approved comments for a specific post
router.get("/post/:postId", async (req, res) => {
  try {
    await connectDB();
    const comments = await Comment.find({ 
      postId: req.params.postId, 
      status: "approved" 
    }).sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// Admin: Get all comments (with optional filtering by status)
router.get("/admin", async (req, res) => {
  try {
    await connectDB();
    const status = req.query.status as string;
    const query = status && status !== "all" ? { status } : {};
    
    const comments = await Comment.find(query)
      .populate("postId", "title slug")
      .sort({ createdAt: -1 });
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// Admin: Update comment status
router.put("/:id/status", async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment status" });
  }
});

// Admin: Delete a comment
router.delete("/:id", async (req, res) => {
  try {
    await connectDB();
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment" });
  }
});

export default router;
