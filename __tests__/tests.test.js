const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: responds with a 200 status code and gets all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        expect(body.topics[0]).toHaveProperty("slug");
        expect(body.topics[0]).toHaveProperty("description");
      });
  });
});
describe("/api/not-an-endpoint", () => {
  test("GET 404: responds with a 400 status code for a path that does not exist", () => {
    return request(app)
      .get("/api/not-an_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint Not Found");
      });
  });
});
