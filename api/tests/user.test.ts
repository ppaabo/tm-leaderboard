import { beforeAll, afterAll, describe, it, expect, inject } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { clearAllCollections, insertTestUser, insertUsers } from "./helpers.js";
import { testUser, adminTestUser, users } from "./test-data/user-data.js";
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

// Admin routes
describe("GET /api/users", () => {
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    await clearAllCollections();
    await insertTestUser(adminTestUser);
    await insertUsers();
    agent = request.agent(app);
    await agent.post("/api/auth/login").send({
      username: adminTestUser.username,
      password: adminTestUser.password,
    });
  });

  it("[Admin] should return all users", async () => {
    const res = await agent.get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(users.length + 1);
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });

  it("should return 403 if not admin", async () => {
    await insertTestUser(testUser);
    const nonAdminAgent = request.agent(app);
    await nonAdminAgent
      .post("/api/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    const res = await nonAdminAgent.get("/api/users");
    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/users", () => {
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    await clearAllCollections();
    await insertTestUser(adminTestUser);
    await insertUsers();
    agent = request.agent(app);
    await agent.post("/api/auth/login").send({
      username: adminTestUser.username,
      password: adminTestUser.password,
    });
  });

  it("[Admin] should delete user with ID", async () => {
    const userToDelete = users[1];
    const res = await agent.delete(`/api/users/${userToDelete._id}`);
    expect(res.status).toBe(204);

    // Verify user is deleted from database
    const userInDb = await User.findOne({ username: userToDelete.username });
    expect(userInDb).toBeNull();
  });

  it("[Admin] should return 404 when user with ID does not exist", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const res = await agent.delete(`/api/users/${invalidId}`);
    expect(res.status).toBe(404);
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });

  it("should return 403 if not admin", async () => {
    await insertTestUser(testUser);
    const nonAdminAgent = request.agent(app);
    await nonAdminAgent
      .post("/api/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    const userToDelete = users[1];
    const res = await nonAdminAgent.delete(`/api/users/${userToDelete._id}`);
    expect(res.status).toBe(403);
  });
});
