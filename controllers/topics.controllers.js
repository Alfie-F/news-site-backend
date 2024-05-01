const { fetchTopics, sendTopic } = require("../models/index.js");

function getTopics(req, res, next) {
  return fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
}

function postTopic(req, res, next) {
  const topicBody = req.body;
  return sendTopic(topicBody)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  postTopic,
};
