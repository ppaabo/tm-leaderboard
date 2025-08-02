import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  accountType: "user" | "admin";
}

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponsePayload = {
  id?: string;
  username: string;
  email: string;
  accountType: "user" | "admin";
};

export type RegisterPayload = {
  username: string;
  password: string;
  email: string;
};
