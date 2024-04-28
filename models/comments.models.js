function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      } else return;
    });
}
function updateComment(comment_id, inc_votes) {
  return db
    .query(
      "UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;",
      [comment_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      } else return rows[0];
    });
}

module.exports = {
  removeComment,
  updateComment,
};
