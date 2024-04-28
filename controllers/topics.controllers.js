const { fetchTopics } = require("../models/index.js");

function getTopics(req, res, next) {
  return fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
}

module.exports = {
  getTopics,
};
