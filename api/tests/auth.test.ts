import { beforeAll, afterAll, describe, it, expect, inject } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { insertTestUser } from "./seed-data/user-data.js";
import User from "../src/models/user.js";
import app from "../src/index.js";

const MONGO_URI = inject("MONGO_URI");
beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

const testUser = {
  username: "authuser",
  email: "authuser@example.com",
  password: "authpass",
};

describe("Auth routes", () => {
  describe("Registration", () => {
    beforeAll(async () => {
      await User.deleteMany({});
    });

    it("should create a new account", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.data.username).toBe(testUser.username);
    });
  });

  describe("Login", () => {
    beforeAll(async () => {
      await User.deleteMany({});
      await insertTestUser(testUser);
    });

    it("should allow valid login", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: testUser.username, password: testUser.password });
      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe(testUser.username);
    });

    it("should support login-logout flow", async () => {
      const agent = request.agent(app);
      await agent
        .post("/api/auth/login")
        .send({ username: testUser.username, password: testUser.password });
      const logout = await agent.post("/api/auth/logout");
      expect(logout.status).toBe(200);
    });
  });
});
