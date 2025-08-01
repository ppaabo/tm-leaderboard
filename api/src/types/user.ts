import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email?: string;
  password: string;
}

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  email: string;
};
