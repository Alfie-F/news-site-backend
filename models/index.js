db = require("../db/connection");

const { fetchTopics } = require("./topics.models");
const {
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkForArticle,
  sendComment,
  updateArticle,
} = require("../models/articles.models");
const { removeComment } = require("./comments.models");
const { fetchUsers } = require("./users.models");

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkForArticle,
  sendComment,
  updateArticle,
  removeComment,
  fetchUsers,
};
