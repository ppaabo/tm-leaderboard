import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/api/test", (req, res) => {
  res.json({ foo: "bar" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
