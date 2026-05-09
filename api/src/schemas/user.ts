import { z } from "zod";

export const zUsername = z
  .string()
  .min(4, { error: "must be at least 4 characters" })
  .max(32, { error: "must be at most 32 characters" });

export const signUpSchema = z.strictObject({
  username: zUsername,
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(8, { error: "must be at least 8 characters" }),
});

export const logInSchema = signUpSchema.omit({ email: true });
