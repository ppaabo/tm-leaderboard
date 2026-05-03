import { Document, Types } from "mongoose";
import { z } from "zod";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  accountType: "user" | "admin";
}

export const signUpSchema = z.object({
  username: z
    .string()
    .min(4, { error: "must be at least 4 characters" })
    .max(32, { error: "must be at most 32 characters" }),
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(8, { error: "must be at least 8 characters" }),
});
