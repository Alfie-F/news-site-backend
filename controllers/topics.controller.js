const {
  fetchTopics,
  fetchAPI,
  fetchArticle,
  fetchArticles,
} = require("../models/topics.models.js");
const jsonData = require("../endpoints.json");

function getTopics(req, res, next) {
  return fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
}

function getAPI(req, res, next) {
  return Promise.resolve(fetchAPI())
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
    .then((data) => res.status(200).send(data))
    .catch(next);
}

module.exports = { getTopics, getAPI, getArticle, getArticles };
