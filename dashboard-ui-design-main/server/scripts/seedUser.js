import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "../models/userModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../config.env") });

const seedUser = async () => {
  try {
    console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete existing user with the same email if exists
    await User.deleteOne({ email: "DuongDA96@gmail.com" });

    // Create new verified user
    const user = await User.create({
      name: "Duong",
      email: "DuongDA96@gmail.com",
      password: "Me01239939838",
      accountVerified: true,
    });

    console.log("User created successfully:", user);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedUser();
