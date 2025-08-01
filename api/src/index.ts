import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";

import initPassport from "./auth/passport-config.js";
import { connectDB } from "./db/connect-db.js";
import userRoutes from "./routes/user-routes.js";
import scoreRoutes from "./routes/score-routes.js";
import categoryRoutes from "./routes/category-routes.js";
import authRoutes from "./routes/auth-routes.js";
import { ApiError } from "./utils/api-errors.js";

dotenv.config();
const app = express();
const PORT = process.env.EXPRESS_PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "session_secret",
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
    console.log(process.env.SESSION_SECRET);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();
