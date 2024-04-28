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
const { removeComment, updateComment } = require("./comments.models");
const { fetchUsers, fetchUser } = require("./users.models");

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
  fetchUser,
  updateComment,
};
