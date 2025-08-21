import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  accountType: "user" | "admin";
}

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthResponsePayload = {
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
