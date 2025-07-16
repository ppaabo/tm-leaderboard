import express from "express";
import { connectDB } from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/scores", scoreRoutes);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();

app.get("/", (req, res) => {
  res.json({ foo: "bar" });
});
