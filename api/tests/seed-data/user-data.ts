import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../src/models/user.js";
import { RegisterPayload } from "shared";

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

// Helper to insert users for test cases
export async function insertUsers(usersArr = users) {
  const usersWithHashed = await Promise.all(
    usersArr.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );
  await User.insertMany(usersWithHashed);
}

export async function insertTestUser(user: RegisterPayload) {
  const hash = await bcrypt.hash(user.password, 10);
  await User.create({
    ...user,
    password: hash,
  });
}
