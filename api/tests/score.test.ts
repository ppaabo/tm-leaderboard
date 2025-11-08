import { beforeAll, afterAll, describe, it, expect, inject } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/index.js";
import User from "../src/models/user.js";
import Score from "../src/models/score.js";
import type { IScore } from "../src/types/score.js";
import { scores } from "./seed-data/score-data.js";
import { users } from "./seed-data/user-data.js";
import {
  insertScoreMetadata,
  insertScores,
  insertUsers,
  insertTestUser,
  clearAllCollections,
} from "./helpers.js";

const MONGO_URI = inject("MONGO_URI");

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
  await clearAllCollections();
  await insertScoreMetadata();
});

afterAll(async () => {
  await mongoose.disconnect();
});

const testUser = {
  username: "scoreuser",
  email: "scoreuser@example.com",
  password: "scorepass",
};

describe("Score routes", () => {
  describe("POST /api/scores", () => {
    let agent: ReturnType<typeof request.agent>;

    beforeAll(async () => {
      await insertTestUser(testUser);
      agent = request.agent(app);
      await agent
        .post("/api/auth/login")
        .send({ username: testUser.username, password: testUser.password });
    });

    it("should allow authenticated user to add a score", async () => {
      const res = await agent
        .post("/api/scores")
        .send({ gamemode: "freestyle", map: "radiant-falls", score: 195000 });
      expect(res.status).toBe(201);
      // Check DB directly for created score
      const score = await Score.findOne({ score: 195000 });
      expect(score).not.toBeNull();
      expect(score?.gamemode).toBe("freestyle");
    });

    it("outcome should be 'ignored' if new score is worse", async () => {
      const res = await agent
        .post("/api/scores")
        .send({ gamemode: "freestyle", map: "radiant-falls", score: 180000 });
      expect(res.status).toBe(200);
      expect(res.body.result).toBe("ignored");
    });

    it("outcome should be 'updated' if new score is better", async () => {
      const res = await agent
        .post("/api/scores")
        .send({ gamemode: "freestyle", map: "radiant-falls", score: 200000 });
      expect(res.status).toBe(200);
      expect(res.body.result).toBe("updated");
    });

    it("Should return 404 for invalid gamemode", async () => {
      const res = await agent
        .post("/api/scores")
        .send({ gamemode: "deatmatch", map: "radiant-falls", score: 195000 });
      expect(res.status).toBe(404);
    });

    it("Should return 404 for invalid map", async () => {
      const res = await agent
        .post("/api/scores")
        .send({ gamemode: "time-trial", map: "dust-2", score: 195000 });
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/scores", () => {
    beforeAll(async () => {
      await User.deleteMany({});
      await Score.deleteMany({});
      await insertUsers();
      await insertScores();
    });

    it("should return all scores", async () => {
      const res = await request(app).get("/api/scores");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(scores.length);
    });

    it("should filter scores by gamemode", async () => {
      const res = await request(app).get("/api/scores?gamemode=freestyle");
      expect(res.status).toBe(200);
      res.body.data.forEach((score: IScore) => {
        expect(score.gamemode).toBe("freestyle");
      });
    });

    it("should filter scores by map", async () => {
      const res = await request(app).get("/api/scores?map=radiant-falls");
      expect(res.status).toBe(200);
      res.body.data.forEach((score: IScore) => {
        expect(score.map).toBe("radiant-falls");
      });
    });

    it("should populate user field", async () => {
      const res = await request(app).get("/api/scores");
      expect(res.status).toBe(200);
      expect(res.body.data[0].user).toHaveProperty("username");
    });
  });

  describe("GET /api/score/user", () => {
    beforeAll(async () => {
      await User.deleteMany({});
      await Score.deleteMany({});
      await insertUsers();
      await insertScores();
    });

    users.forEach((user) => {
      it(`should return correct scores for user ${user.username}`, async () => {
        const res = await request(app).get(`/api/scores/user/${user.username}`);
        expect(res.status).toBe(200);
        // Get user scores from test data
        const expectedScores = scores.filter(
          (s) => s.user.toString() === user._id.toString()
        );
        expect(res.body.data).toHaveLength(expectedScores.length);
        // Check that response contains all the expected scores for user
        expectedScores.forEach((expectedScore) => {
          expect(res.body.data).toContainEqual(
            expect.objectContaining({
              gamemode: expectedScore.gamemode,
              map: expectedScore.map,
              score: expectedScore.score,
              user: expect.objectContaining({ username: user.username }),
            })
          );
        });
      });
    });
  });
});
