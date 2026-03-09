import express from "express";
import { BlogPost } from "../models/BlogPost.js";
import { connectDB } from "../db.js";

const router = express.Router();

// Generate slug from title
const generateSlug = (title: string) => {
  if (!title) return "post-" + Date.now();
  const slug = title.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  return slug || "post-" + Date.now();
};

// Calculate reading time
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Get all published posts (with pagination and search)
router.get("/", async (req, res) => {
  try {
    await connectDB();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.q as string;
    const category = req.query.category as string;

    const query: any = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Get single post by slug
router.get("/:slug", async (req, res) => {
  try {
    await connectDB();
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Admin routes (In a real app, protect these with auth middleware)

// Get all posts (including drafts) for admin
router.get("/admin/all", async (req, res) => {
  try {
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error: any) {
    console.error("Error fetching admin posts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
});

// Create post
router.post("/create", async (req, res) => {
  try {
    await connectDB();
    const { title, excerpt, content, category, status, tags, coverImage } = req.body;
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: "Missing required fields: title, excerpt, content" });
    }

    let slug = generateSlug(title);
    
    // Ensure unique slug
    let existing = await BlogPost.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${generateSlug(title)}-${counter}`;
      existing = await BlogPost.findOne({ slug });
      counter++;
    }

    const readingTime = calculateReadingTime(content);

    const post = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      category,
      status,
      tags,
      coverImage,
      readingTime,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error: any) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
});

// Update post
router.put("/:id", async (req, res) => {
  try {
    await connectDB();
    const { title, excerpt, content, category, status, tags, coverImage } = req.body;
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: "Missing required fields: title, excerpt, content" });
    }

    const updateData: any = {
      title,
      excerpt,
      content,
      category,
      status,
      tags,
      coverImage,
    };

    if (content) {
      updateData.readingTime = calculateReadingTime(content);
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error: any) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    await connectDB();
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Like post
router.post("/:id/like", async (req, res) => {
  try {
    await connectDB();
    const { deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required to like a post" });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the device has already liked the post
    if (post.likedBy && post.likedBy.includes(deviceId)) {
      // User has already liked it, so we unlike it (toggle)
      post.likedBy = post.likedBy.filter(id => id !== deviceId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // User hasn't liked it, so we add the like
      if (!post.likedBy) post.likedBy = [];
      post.likedBy.push(deviceId);
      post.likes += 1;
    }

    await post.save();
    res.json({ likes: post.likes, likedBy: post.likedBy });
  } catch (error) {
    res.status(500).json({ message: "Error liking post" });
  }
});

export default router;
