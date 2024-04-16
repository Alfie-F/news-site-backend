const { fetchTopics, fetchAPI } = require("../models/topics.models.js");
const jsonData = require("../endpoints.json");

function getTopics(req, res, next) {
  return fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
}

function getAPI(req, res, next) {
  return Promise.all([fetchAPI()]).then((data) => {
    let parsedData = { api: JSON.parse(data) };
    return res.status(200).send(parsedData);
  });
}

module.exports = { getTopics, getAPI };
