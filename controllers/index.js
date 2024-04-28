fs = require("fs/promises");

const { getTopics } = require("./topics.controllers");
const { getAPI } = require("./api.controllers");
const {
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
} = require("./articles.controllers");
const { deleteComment } = require("./comments.controllers");
const { getUsers, getUser } = require("./users.controllers");

module.exports = {
  getTopics,
  getAPI,
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
  getUser,
};
