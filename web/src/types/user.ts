import { z } from "zod";
export type SignUpValidationState = {
  username: boolean | undefined;
  email: boolean | undefined;
  password: boolean | undefined;
  passwordConfirm: boolean | undefined;
};

export type LoginValidationState = {
  username: boolean | undefined;
  password: boolean | undefined;
};

export const signUpSchema = z.strictObject({
  username: z.string().min(4).max(32),
  email: z.email(),
  password: z.string().min(8),
});

export const logInSchema = signUpSchema.omit({ email: true });

export type SignUpInput = z.infer<typeof signUpSchema>;
