db = require("../db/connection");

function fetchTopics() {
  let sqlGet = "SELECT * FROM topics;";
  return db.query(`${sqlGet}`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticle(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else return rows[0];
    });
}

function fetchArticles() {
  return db
    .query(
      "SELECT articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id, title, topic, articles.author, articles.created_at, article_img_url, articles.votes ORDER BY created_at DESC;;"
    )
    .then(({ rows }) => {
      return rows;
    });
}

function fetchComments(article_id) {
  return db
    .query(
      "SELECT * FROM comments where article_id = $1 ORDER BY created_at ASC",
      [article_id]
    )
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

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchArticles,
  fetchComments,
  sendComment,
  fixArticle,
};
