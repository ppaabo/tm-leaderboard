import mongoose from "mongoose";

export const connectDB = (async () => {
    const mongoUrl: string = process.env.MONGO_URL || "mongodb://mongodb:27017/test";
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
    // return mongoose
})