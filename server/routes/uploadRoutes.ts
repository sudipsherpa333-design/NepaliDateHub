import express from "express";
import multer from "multer";
import { Image } from "../models/Image";
import { connectDB } from "../db";

const router = express.Router();

// Configure multer storage to use memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit to stay under MongoDB 16MB document limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    await connectDB();
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save image to MongoDB
    const image = new Image({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });

    await image.save();

    // Return the URL to access the uploaded file
    const fileUrl = `/api/upload/${image._id}`;
    res.status(200).json({ url: fileUrl, message: "Image uploaded successfully" });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await connectDB();
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error: any) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image", error: error.message });
  }
});

export default router;
