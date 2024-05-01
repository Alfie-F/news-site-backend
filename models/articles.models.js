const { keys } = require("../db/data/test-data/articles");

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

function fetchComments(article_id, query) {
  let limit = 50;
  let p = 0;
  if (query.limit && query.limit >= 1) {
    limit = Number(query.limit);
    if (query.p && query.p >= 1) {
      p = Number(query.p);
    }
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC LIMIT ${limit} OFFSET ${p}`,
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

function checkForUser(author) {
  return db.query("SELECT username FROM users").then(({ rows }) => {
    let usernames = rows.map((row) => row.username);
    if (usernames.includes(author.username)) {
      return;
    } else
      return Promise.reject({ status: 400, msg: "username does not exist" });
  });
}

function checkForAuthor(authorReq) {
  return db.query("SELECT username FROM users").then(({ rows }) => {
    let authors = rows.map((row) => row.username);
    if (authors.includes(authorReq.author)) {
      return;
    } else return Promise.reject({ status: 400, msg: "author does not exist" });
  });
}

function sendComment(articleID, commentBody) {
  if (Object.keys(commentBody).length > 2)
    return Promise.reject({
      status: 400,
      msg: "too many keys on submitted object",
    });
  return db
    .query(
      "INSERT INTO comments (author, body, article_id, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *",
      [commentBody.username, commentBody.body, articleID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateArticle(article_id, inc_votes) {
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

function sendArticle(body) {
  if (Object.keys(body).length > 5)
    return Promise.reject({
      status: 400,
      msg: "too many keys on submitted object",
    });
  return db
    .query(
      "INSERT INTO articles (author, title, body, topic, article_img_url, votes, comment_count, created_at) VALUES ($1, $2, $3, $4, $5, 0, 0, NOW()) RETURNING *",
      [
        body.author,
        body.title,
        body.body,
        body.topic,
        body.article_img_url || "www.google.com",
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function addCommentCount() {
  return db
    .query("ALTER TABLE articles ADD comment_count SMALLINT DEFAULT 0;")
    .then(() => {
      return;
    });
}

module.exports = {
  fetchArticle,
  fetchComments,
  checkForArticle,
  checkForAuthor,
  checkForUser,
  sendComment,
  updateArticle,
  sendArticle,
  addCommentCount,
};

// ALTER TABLE articles ADD COLUMN comment_count SMALLINT
