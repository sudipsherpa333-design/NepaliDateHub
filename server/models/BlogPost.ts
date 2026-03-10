import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  author: { type: String, default: "Admin" },
  tags: [{ type: String }],
  category: { type: String },
  readingTime: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true });

export const BlogPost = (mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema)) as any;
