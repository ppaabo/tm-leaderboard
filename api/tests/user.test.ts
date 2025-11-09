import { beforeAll, afterAll, describe, it, expect, inject } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { clearAllCollections, insertTestUser } from "./helpers.js";
import { testUser } from "./test-data/user-data.js";
import User from "../src/models/user.js";
import app from "../src/index.js";

const MONGO_URI = inject("MONGO_URI");
beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
  await clearAllCollections();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("DELETE /api/users/me", () => {
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    await insertTestUser(testUser);
    agent = request.agent(app);
    await agent
      .post("/api/auth/login")
      .send({ username: testUser.username, password: testUser.password });
  });

  it("should delete user's own account", async () => {
    const res = await agent.delete("/api/users/me");
    expect(res.status).toBe(204);

    // Verify user is deleted from database
    const userInDb = await User.findOne({ username: testUser.username });
    expect(userInDb).toBeNull();
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).delete("/api/users/me");
    expect(res.status).toBe(401);
  });
});
