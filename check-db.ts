import mongoose from "mongoose";
import dotenv from "dotenv";
import { AdminUser } from "./server/models/AdminUser.js";

dotenv.config();

async function checkDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to DB");
    const admin = await AdminUser.findOne({ username: "admin" });
    if (admin) {
      console.log("Admin found:", admin.username, admin.password);
    } else {
      console.log("Admin not found");
    }
  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

checkDb();
