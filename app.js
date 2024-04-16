const express = require("express");
const app = express();
app.use(express.json());
const {
  getTopics,
  getAPI,
  getArticle,
} = require("./controllers/topics.controller.js");

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticle);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
  else next(err);
});

module.exports = app;
