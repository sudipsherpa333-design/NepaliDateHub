import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  createdAt: { type: Date, default: Date.now }
});

export const Image = (mongoose.models.Image || mongoose.model("Image", imageSchema)) as any;
