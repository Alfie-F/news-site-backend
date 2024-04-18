db = require("../db/connection");

function fetchTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function fetchArticle(article_id) {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.*, comments.article_id, articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else return rows[0];
    });
}

function fetchArticles(sort_by) {
  const validQueries = ["mitch", "cats"];
  if (sort_by !== undefined && !validQueries.includes(sort_by)) {
    return Promise.reject({ status: 403, msg: "topic does not exist" });
  }
  let sqlQuery =
    "SELECT articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
  if (validQueries.includes(sort_by)) {
    sqlQuery += ` WHERE topic = '${sort_by}'`;
  }
  sqlQuery +=
    " GROUP BY articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes ORDER BY created_at DESC;";
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
}

function fetchComments(article_id) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      } else return rows;
    });
}
function checkForArticle(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else return rows;
    });
}

function sendComment(articleID, commentBody) {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *",
      [commentBody.username, commentBody.body, articleID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function fixArticle(article_id, inc_votes) {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else return rows[0];
    });
}

function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      } else return;
    });
}

function fetchUsers() {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
}

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkForArticle,
  sendComment,
  fixArticle,
  removeComment,
  fetchUsers,
};
