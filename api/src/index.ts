import express from "express";
import { connectDB } from "./database.js";

const app = express();
const PORT = process.env.PORT || 8080;

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
  res.send("Hello!");
});

app.get("/api/test", (req, res) => {
  res.json({ foo: "bar" });
});
