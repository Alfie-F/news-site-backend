const {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkForArticle,
  sendComment,
  fixArticle,
  removeComment,
  fetchUsers,
} = require("../models/topics.models.js");
fs = require("fs/promises");
const path = `./endpoints.json`;

function getTopics(req, res, next) {
  return fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
}

function getAPI(req, res, next) {
  return fs
    .readFile(path, "utf8")
    .then((data) => {
      let parsedData = { api: JSON.parse(data) };
      res.status(200).send(parsedData);
    })
    .catch(next);
}

function getArticle(req, res, next) {
  const { article_id } = req.params;
  return fetchArticle(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  return fetchArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
}

function getComments(req, res, next) {
  const { article_id } = req.params;
  return checkForArticle(article_id)
    .then(() => {
      return fetchComments(article_id);
    })
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const commentBody = req.body;
  return sendComment(article_id, commentBody)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
}
function patchArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return fixArticle(article_id, inc_votes)
    .then((data) => {
      res.status(200).send({ update: data });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

function getUsers(req, res, next) {
  return fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
}

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
};
