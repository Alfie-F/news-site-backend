const express = require("express");
const app = express();
const {
  getTopics,
  getAPI,
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
} = require("./controllers/topics.controller.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502")
    return res.status(400).send({ msg: "Bad request" });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503")
    return res.status(404).send({ msg: "article does not exist" });
  else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ msg: "you should not see this error message" });
});

module.exports = app;
