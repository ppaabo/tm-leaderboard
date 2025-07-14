import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl: string =
      process.env.MONGO_URL || "mongodb://mongodb:27017/leaderboard";
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export { connectDB };
