const { removeComment } = require("../models/index.js");

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

module.exports = {
  deleteComment,
};
