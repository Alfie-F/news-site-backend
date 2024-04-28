const { fetchUsers, fetchUser } = require("../models/index.js");

function getUsers(req, res, next) {
  return fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
}

function getUser(req, res, next) {
  const { username } = req.params;
  return fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
};
