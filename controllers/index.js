fs = require("fs/promises");

const { getTopics } = require("./topics.controllers");
const { getAPI } = require("./api.controllers");
const {
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  postArticle,
} = require("./articles.controllers");
const { deleteComment, patchComment } = require("./comments.controllers");
const { getUsers, getUser } = require("./users.controllers");

module.exports = {
  patchComment,
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
  postArticle,
};
