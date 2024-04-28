const { removeComment, updateComment } = require("../models/index.js");

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

function patchComment(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  return updateComment(comment_id, inc_votes)
    .then((data) => {
      res.status(200).send({ update: data });
    })
    .catch(next);
}

module.exports = {
  deleteComment,
  patchComment,
};
