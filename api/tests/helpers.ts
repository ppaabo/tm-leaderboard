import mongoose from "mongoose";
import Score from "../src/models/score.js";
import User from "../src/models/user.js";
import { scores } from "./test-data/score-data.js";
import { users } from "./test-data/user-data.js";
import bcrypt from "bcrypt";
import { RegisterPayload } from "shared";
import { Gamemode, Map } from "../src/models/score-metadata.js";
import { gamemodes, maps } from "./test-data/category-data.js";

// Clear all collections
export async function clearAllCollections() {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
  console.log("Collections cleared");
}

// Helpers to insert data for tests
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

export async function insertScores(scoresArr = scores) {
  await Score.insertMany(scoresArr);
}

export async function insertScoreMetadata(
  gamemodesArr = gamemodes,
  mapsArr = maps
) {
  await Gamemode.insertMany(gamemodesArr);
  await Map.insertMany(mapsArr);
}
