const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const endpointapi = require("../endpoints.json");
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
      .then(({ body }) => {
        expect(body.api).toEqual(endpointapi);
      });
  });
});

describe("/api/articles/:article_id", () => {
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

  test("GET 404: responds with a 404 status code and returns custom error when the query is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET 400: responds with a 400 status code and custom bad request error message when the query is not valid", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with a 200 status code and gets all articles, in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        let { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("comment_count");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with a 200 status code and all comments on that article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        let { comments } = body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.votes).toBe("number");
        });
        expect(comments).toBeSortedBy("created_at");
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
  test("GET 400: responds with a 400 status code and custom bad request error message when article_id is not of correct type", () => {
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
        expect(body.msg).toBe("comment does not exist");
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
  test("POST 404: responds with a 404 status code and returns custom error when the article_id is valid but non existent", () => {
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
  test("POST 400: responds with a 400 status code and returns bad request error message when article_id is a bad request", () => {
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
      ingredients: "toast, butter, ham, cheese",
    };
    return request(app)
      .post("/api/articles/still-not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when body contains too many keys", () => {
    const newComment = {
      username: "icellusedkars",
      body: "sam approves this message",
      ingredients: "toast, butter, ham, cheese",
    };
    return request(app)
      .post("/api/articles/still-not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when author is not on database", () => {
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

describe("/api/articles/:article_id", () => {
  test("PATCH 200; responds with a 200 code and updates an existing article, and responds to user with the updated article", () => {
    const update = {
      inc_votes: -20,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        let updatedArticle = body.update;
        expect(updatedArticle).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("PATCH 404: responds with a 404 status code and returns custom error when the article is a valid query but does not exist", () => {
    const update = {
      inc_votes: -20,
    };
    return request(app)
      .patch("/api/articles/9999")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the query is invalid", () => {
    const update = {
      inc_votes: -20,
    };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the vote increment is not a number", () => {
    const update = {
      inc_votes: "ham sandwich",
    };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comments and sends no body back", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(!body.msg).toBe(true);
      });
  });
  test("DELETE:404 responds with an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/30000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: responds with a 200 status code and gets all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        let users = body.users;
        expect(users).toHaveLength(4);
        console.log(users);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
