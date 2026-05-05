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

export const signUpSchema = z
  .strictObject({
    username: z.string().min(4).max(32),
    email: z.email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export const logInSchema = z.strictObject({
  username: z.string().min(4).max(32),
  password: z.string().min(1),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
