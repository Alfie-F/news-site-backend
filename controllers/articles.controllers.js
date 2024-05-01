const {
  fetchTopics,
  fetchArticle,
  fetchComments,
  checkForArticle,
  checkForAuthor,
  checkForUser,
  sendComment,
  updateArticle,
  sendArticle,
  addCommentCount,
  fetchArticlesALL,
  totalArticles,
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
  let TA = 0;
  return totalArticles()
    .then((total) => {
      TA = Number(total);
      return fetchTopics();
    })
    .then((topics) => {
      return fetchArticlesALL(req.query, topics);
    })
    .then((articles) =>
      res.status(200).send({ articles: articles, total_count: TA })
    )
    .catch(next);
}

function getComments(req, res, next) {
  const { article_id } = req.params;
  return checkForArticle(article_id)
    .then(() => {
      return fetchComments(article_id, req.query);
    })
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const commentBody = req.body;
  return checkForUser(req.body)
    .then(() => {
      return sendComment(article_id, commentBody);
    })
    .then((comment) => {
      res.status(201).send({ comment });
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

function postArticle(req, res, next) {
  const articleBody = req.body;
  return checkForAuthor(req.body)
    .then(() => {
      return addCommentCount();
    })
    .then(() => {
      return sendArticle(articleBody);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  postArticle,
};
