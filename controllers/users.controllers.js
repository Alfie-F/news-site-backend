const { fetchUsers } = require("../models/index.js");

function getUsers(req, res, next) {
  return fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
}

module.exports = {
  getUsers,
};
