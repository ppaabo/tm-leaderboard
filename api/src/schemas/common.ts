import { z } from "zod";
import mongoose from "mongoose";

export const zObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    error: "Invalid ID",
  });
