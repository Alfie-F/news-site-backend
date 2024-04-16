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
describe("/api", () => {
  test("GET 200: responds with a 200 status code and gets all apis", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((body) => {
        let parse = JSON.parse(body.text);
        expect(typeof parse).toBe("object");
        //hi to whoever is reviewing my code! I really struggled with this question, I came up with multiple solutions but all of them would need further parsing once in thr test block,which I know isn't really correct, some advice on how to fix this in the future in your response would be absolutely wonderful, thanks in advance!
        expect(parse.api["GET/api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
      });
  });
});
