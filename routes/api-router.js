const express = require("express");
const articles = require("./articles-router");

const {
  getTopics,
  getAPI,
  deleteComment,
  getUsers,
  getUser,
  patchComment,
  postTopic,
} = require("../controllers/index");

let api = express.Router();

api.use(express.json());

api.use("/articles", articles);

api.get("", getAPI);

api.route("/topics").get(getTopics).post(postTopic);

api.route("/comments/:comment_id").delete(deleteComment).patch(patchComment);

api.get("/users", getUsers);

api.get("/users/:username", getUser);

module.exports = api;
