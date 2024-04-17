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
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
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
        expect(parse.api["GET/api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
      });
  });
});
describe("/api/topics", () => {
  test("GET 200: responds with a 200 status code and gets all topics", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        let article = body.article;
        expect(article.article_id).toBe(7);
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        expect(article.article_img_url.indexOf("https")).toBe(0);
      });
  });
  test("GET 404: responds with a 404 status code and returns custom error", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET 400: responds with a 400 status code and custom bad request error message", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("/api/articles", () => {
  test("GET 200: responds with a 200 status code and gets all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(13);
        body.forEach((topic) => {
          expect(topic).toHaveProperty("title");
          expect(topic).toHaveProperty("topic");
          expect(topic).toHaveProperty("author");
          expect(topic).toHaveProperty("created_at");
          expect(topic).toHaveProperty("article_img_url");
          expect(topic).toHaveProperty("article_id");
          expect(topic).toHaveProperty("votes");
          expect(topic).toHaveProperty("comment_count");
        });
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
});
