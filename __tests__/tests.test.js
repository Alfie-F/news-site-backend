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
describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with a 200 status code and comment when only one comment for that article", () => {
    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then(({ body }) => {
        body = body[0];
        expect(body.article_id).toBe(6);
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
      });
  });
  test("GET 200: responds with a 200 status code and all comments on that article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.forEach((body) => {
          expect(body.article_id).toBe(1);
          expect(typeof body.author).toBe("string");
          expect(typeof body.body).toBe("string");
          expect(typeof body.created_at).toBe("string");
          expect(typeof body.votes).toBe("number");
        });
        expect(body).toBeSortedBy("created_at");
      });
  });
  test("GET 404: responds with a 404 status code and returns custom error when request is valid but author does not exist", () => {
    return request(app)
      .get("/api/articles/12345/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET 400: responds with a 400 status code and custom bad request error message", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 404: responds with a 404 status code when requesting a comment from an author that exists but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("POST 201: responds with a 201 status code and adds the new comment to the existing database, then returns to user what was added", () => {
    const newComment = {
      username: "icellusedkars",
      body: "sam approves this message",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(200)
      .then(({ body }) => {
        body = body.comment;
        expect(body.article_id).toBe(6);
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
      });
  });
  test("POST 404: responds with a 404 status code and returns custom error", () => {
    const newComment = {
      username: "icellusedkars",
      body: "sam approves this message",
    };
    return request(app)
      .post("/api/articles/66666/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message", () => {
    const newComment = {
      username: "icellusedkars",
      body: "sam approves this message",
    };
    return request(app)
      .post("/api/articles/still-not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when body is incorrect/incomplete", () => {
    const newComment = {
      ingredients: "toast, butter, ham. cheese",
    };
    return request(app)
      .post("/api/articles/still-not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when author does not exist on approved authors", () => {
    const newComment = {
      username: "mrCool",
      body: "sam approves this message",
    };
    return request(app)
      .post("/api/articles/still-not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
