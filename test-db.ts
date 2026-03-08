import mongoose from "mongoose";

const uri = "mongodb+srv://sudipsherpa333_db_user:IlIuFNAyO5jKq36S@calc.z8ggqua.mongodb.net/calc?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
