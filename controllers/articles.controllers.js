const {
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkForArticle,
  sendComment,
  updateArticle,
} = require("../models/");

function getArticle(req, res, next) {
  const { article_id } = req.params;
  return fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { sort_by } = req.query;
  return fetchArticles(sort_by)
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
  return updateArticle(article_id, inc_votes)
    .then((data) => {
      res.status(200).send({ update: data });
    })
    .catch(next);
}

module.exports = {
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
};
