const express = require("express");
const articles = require("./articles-router");

const {
  getTopics,
  getAPI,
  deleteComment,
  getUsers,
} = require("../controllers/index");

let api = express.Router();

api.use(express.json());

api.use("/articles", articles);

api.get("", getAPI);

api.get("/topics", getTopics);

api.delete("/comments/:comment_id", deleteComment);

api.get("/users", getUsers);

module.exports = api;
