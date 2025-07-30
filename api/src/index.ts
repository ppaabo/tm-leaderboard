import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import initPassport from "./auth/passport-config.js";
import { connectDB } from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/auth.js";
import { ApiError } from "./utils/apiErrors.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let response: { status: string; message: string };
  if (err instanceof ApiError) {
    err.log();
    response = { status: "error", message: err.message };
    res.status(err.status).json(response);
  } else {
    console.error("Error: ", err?.message);
    response = { status: "error", message: "Unknown exception" };
    res.status(500).json(response);
  }
});

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
