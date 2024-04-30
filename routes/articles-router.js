const express = require("express");

const {
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  postArticle,
} = require("../controllers/index");

let articles = express.Router();

articles.use(express.json());

articles.route("").get(getArticles).post(postArticle);

articles.route("/:article_id").get(getArticle).patch(patchArticle);

articles.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = articles;
