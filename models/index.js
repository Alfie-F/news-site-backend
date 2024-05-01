db = require("../db/connection");
const { fetchArticlesALL, totalArticles } = require("./allArticles.model");
const { fetchTopics } = require("./topics.models");
const {
  fetchArticle,
  fetchComments,
  checkForArticle,
  sendComment,
  updateArticle,
  sendArticle,
  addCommentCount,
} = require("../models/articles.models");
const { removeComment, updateComment } = require("./comments.models");
const { fetchUsers, fetchUser } = require("./users.models");

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchComments,
  checkForArticle,
  sendComment,
  updateArticle,
  removeComment,
  fetchUsers,
  fetchUser,
  updateComment,
  sendArticle,
  addCommentCount,
  fetchArticlesALL,
  totalArticles,
};
