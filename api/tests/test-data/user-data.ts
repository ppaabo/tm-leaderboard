import mongoose from "mongoose";

export const users = [
  {
    _id: new mongoose.Types.ObjectId("64b7c2f1e1a2b3c4d5e6f7a1"),
    username: "ShadowVex",
    email: "shadowvex@example.com",
    password: "shadowvex",
    accountType: "admin",
  },
  {
    _id: new mongoose.Types.ObjectId("64b7c2f1e1a2b3c4d5e6f7a2"),
    username: "PulseNova",
    email: "pulsenova@example.com",
    password: "pulsenova",
    accountType: "user",
  },
  {
    _id: new mongoose.Types.ObjectId("64b7c2f1e1a2b3c4d5e6f7a3"),
    username: "CrimsonBolt",
    email: "crimsonbolt@example.com",
    password: "crimsonbolt",
    accountType: "user",
  },
];

export const testUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpass",
  accountType: "user",
};

export const adminTestUser = {
  username: "testadmin",
  email: "testadmin@example.com",
  password: "testpass",
  accountType: "admin",
};
