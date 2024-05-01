const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const endpointapi = require("../endpoints.json");
const testData = require("../db/data/test-data/index.js");
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: responds with a 200 status code and gets all topics.", () => {
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
  test("GET 404: responds with a 400 status code for a path that does not exist.", () => {
    return request(app)
      .get("/api/not-an-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint Not Found");
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with a 200 status code and gets all apis.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.api).toEqual(endpointapi);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with a 200 status code and gets the correct article.", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        let { article } = body;
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

  test("GET 404: responds with a 404 status code and returns custom error when the query is valid but does not exist.", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET 400: responds with a 400 status code and custom bad request error message when the query is not valid.", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with a 200 status code and gets all articles, in descending order.", () => {
    return request(app)
      .get("/api/articles?limit=20")
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
  test("GET 200: responds with a 200 status code and all comments on that article.", () => {
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
  test("GET 404: responds with a 404 status code and returns custom error when request is valid but author does not exist.", () => {
    return request(app)
      .get("/api/articles/12345/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET 400: responds with a 400 status code and custom bad request error message when article_id is not of correct type.", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 404: responds with a 404 status code when requesting a comment from an author that exists but has no comments.", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST 201: responds with a 201 status code and adds the new comment to the existing database, then returns to user what was added.", () => {
    const newComment = {
      username: "icellusedkars",
      body: "sam approves this message",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        body = body.comment;
        expect(body.article_id).toBe(6);
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
      });
  });
  test("POST 404: responds with a 404 status code and returns custom error when the article_id is valid but non existent.", () => {
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
  test("POST 400: responds with a 400 status code and returns bad request error message when article_id is a bad request.", () => {
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
  test("POST 400: responds with a 400 status code and returns bad request error message when body is incorrect/incomplete.", () => {
    const newComment = {
      username: "icellusedkars",
      ingredients: "toast, butter, ham, cheese",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when body contains too many keys.", () => {
    const newComment = {
      username: "icellusedkars",
      body: "sam approves this message",
      ingredients: "toast, butter, ham, cheese",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("too many keys on submitted object");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when author is not on the database.", () => {
    const newComment = {
      username: "mrCool",
      body: "sam approves this message",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH 200; responds with a 200 code and updates an existing article, and responds to user with the updated article.", () => {
    const update = {
      inc_votes: -20,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        let { update } = body;
        expect(update.votes).toEqual(80);
        expect(update).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("PATCH 404: responds with a 404 status code and returns custom error when the article is a valid query but does not exist.", () => {
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
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the query is invalid.", () => {
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
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the vote increment is not a number.", () => {
    const update = {
      inc_votes: "ham sandwich",
    };
    return request(app)
      .patch("/api/articles/7")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the vote increment key is misspelled.", () => {
    const update = {
      votes: "6",
    };
    return request(app)
      .patch("/api/articles/7")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 200: responds with a 200 when there is a a valid key in the update object, ignoring any non valid keys.", () => {
    const update = {
      inc_votes: "-55",
      recipe: "make sandwich",
      ingredients: "bacon, lettuce, tomato",
    };
    return request(app)
      .patch("/api/articles/4")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        let { update } = body;
        expect(update.votes).toEqual(-55);
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comments and sends no body back.", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {});
  });

  test("DELETE:404 responds with an appropriate status and error message when given a valid but non-existent id.", () => {
    return request(app)
      .delete("/api/comments/30000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id.", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: responds with a 200 status code and gets all users.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        let { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
describe("/api/articles?sort_by=topic_query", () => {
  test("GET 200: Responds with a 200 status code and gets list of articles filtered by the topic the client specifies in the query.", () => {
    return request(app)
      .get("/api/articles?topic=mitch&limit=20")
      .expect(200)
      .then(({ body }) => {
        let { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 403: Responds with a 403 status code when request is not on greenlist.", () => {
    return request(app)
      .get("/api/articles?topic=recipes&limit=20")
      .expect(403)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "topic does not exist",
        });
      });
  });
  test("GET 404: Responds with a 404 status code when request is on greenlist but has no associated articles.", () => {
    return request(app)
      .get("/api/articles?topic=paper&limit=20")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "no articles exist for topic",
        });
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET 200: adds additional functionality to includes comment_count in returned object, which counts the amount of comments with the corresponding article id.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        let { article } = body;
        expect(typeof article.comment_count).toBe("number");
        expect(article.comment_count).toBe(11);
      });
  });
});

describe("/api/articles?sort_by=topic_category", () => {
  test("GET 200: Responds with a 200 status code and gets list of articles ordered by any valid column - desc by default.", () => {
    return request(app)
      .get("/api/articles?sort_by=author&limit=20")
      .expect(200)
      .then(({ body }) => {
        let { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET 403: Responds with a 403 status code when request is not on greenlist.", () => {
    return request(app)
      .get("/api/articles?sort_by=author_name&limit=20")
      .expect(403)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "topic does not exist",
        });
      });
  });
  test("GET 200: Responds with a 200 status code and gets list of articles ordered by any valid column, if any, and can order by asc or desc.", () => {
    return request(app)
      .get("/api/articles?order=asc&limit=20")
      .expect(200)
      .then(({ body }) => {
        let { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("GET 200: Responds with a 200 status code and gets list of articles ordered by any valid column, filtered by a value in that column, if any, and can order by asc or desc (as it has been filtered the order will be the same either way, but should not break code).", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc&limit=20")
      .expect(200)
      .then(({ body }) => {
        let { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with a 200 status code and gets the correct user.", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        let { user } = body;
        expect(user.username).toBe("butter_bridge");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
        expect(user.avatar_url.indexOf("https")).toBe(0);
      });
  });

  test("GET 404: responds with a 404 status code and returns custom error when the query is valid but does not exist.", () => {
    return request(app)
      .get("/api/users/steve")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH 200; responds with a 200 code and updates an existing comment, and responds to user with the updated comment.", () => {
    const update = {
      inc_votes: +2000,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        let { update } = body;
        expect(update.votes).toEqual(2016);
        expect(update.comment_id).toEqual(1),
          expect(update).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
      });
  });
  test("PATCH 404: responds with a 404 status code and returns custom error when the comment is a valid query but does not exist.", () => {
    const update = {
      inc_votes: -20,
    };
    return request(app)
      .patch("/api/comments/9999")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the query is invalid.", () => {
    const update = {
      inc_votes: -20,
    };
    return request(app)
      .patch("/api/comments/not-a-comment")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the vote increment is not a number.", () => {
    const update = {
      inc_votes: "ham sandwich",
    };
    return request(app)
      .patch("/api/comments/7")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with a 400 status code and custom bad request error message when the vote increment key is misspelled.", () => {
    const update = {
      votes: "6",
    };
    return request(app)
      .patch("/api/comments/7")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 200: responds with a 200 when there is a a valid key in the update object, ignoring any non valid keys.", () => {
    const update = {
      inc_votes: "155",
      recipe: "make sandwich",
      ingredients: "bacon, lettuce, tomato",
    };
    return request(app)
      .patch("/api/comments/4")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        let { update } = body;
        expect(update.votes).toEqual(55);
      });
  });
});

describe("/api/articles", () => {
  test("POST 201: responds with a 201 status code and adds the new article to the existing database, then returns to user what was added - also adds comment_count category and deafuaults article_img_url if not provided.", () => {
    const newArticle = {
      author: "rogersop",
      title: "my very good article",
      body: "sam approves this message",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(200)
      .then(({ body }) => {
        body = body.article;
        expect(body.article_id).toBe(14);
        expect(typeof body.author).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
        expect(body.article_img_url).toBe("www.google.com");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when body is incorrect/incomplete.", () => {
    const newArticle = {
      author: "rogersop",
      title: "my very good article",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when body contains too many keys.", () => {
    const newArticle = {
      author: "rogersop",
      title: "my very good article",
      body: "sam approves this message",
      topic: "cats",
      sausage: "roll",
      ham: "cheese",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("too many keys on submitted object");
      });
  });
  test("POST 400: responds with a 400 status code and returns bad request error message when author is not on the database.", () => {
    const newArticle = {
      author: "mrCool",
      title: "my very good article",
      body: "sam approves this message",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("author does not exist");
      });
  });
});
describe("/api/articles", () => {
  test("GET 200: responds with a 200 status code and gets pagination of articles, in descending order.", () => {
    return request(app)
      .get("/api/articles?limit=4&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(13);
        let { articles } = body;
        expect(articles).toHaveLength(4);
        expect(articles[0].article_id).toBe(12);
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
  test("GET 404: Responds with a 404 status code when request is not valid (too high or low, or misspelled).", () => {
    return request(app)
      .get("/api/articles?limit=4&p=20")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "no articles exist for topic",
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with a 200 status code and all comments on that article, adding pagination to this.", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        let { comments } = body;
        expect(comments).toHaveLength(5);
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
  test("defaults if either limit or page is zero.", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0&p=2")
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
  test("defaults if either limit or page is zero.", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0")
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
  test("defaults successfully if no limit but page is provided.", () => {
    return request(app)
      .get("/api/articles/1/comments?p=3")
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
});
describe("/api/topics", () => {
  test("HANDLE POST 201: responds with a 201 status code and adds the new topic to the existing database, then returns to user what was added.", () => {
    const newComment = {
      slug: "cool people",
      description: "whoever is reading this <3",
    };
    return request(app)
      .post("/api/topics")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        body = body.topic;
        expect(typeof body.slug).toBe("string");
        expect(typeof body.description).toBe("string");
      });
  });
  test("HANDLE POST 400: responds with a 400 status code and returns bad request error message when body is incorrect/incomplete.", () => {
    const newComment = {
      ingredients: "toast, butter, ham, cheese",
    };
    return request(app)
      .post("/api/topics")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  // test("HANDLE POST 400: responds with a 400 status code and returns bad request error message when body contains too many keys.", () => {
  //   const newComment = {
  //     username: "icellusedkars",
  //     body: "sam approves this message",
  //     ingredients: "toast, butter, ham, cheese",
  //   };
  //   return request(app)
  //     .post("/api/articles/still-not-an-article/comments")
  //     .send(newComment)
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad request");
  //     });
  // });
  // test("HANDLE POST 400: responds with a 400 status code and returns bad request error message when author is not on the database.", () => {
  //   const newComment = {
  //     username: "mrCool",
  //     body: "sam approves this message",
  //   };
  //   return request(app)
  //     .post("/api/articles/still-not-an-article/comments")
  //     .send(newComment)
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad request");
  //     });
  // });
});
