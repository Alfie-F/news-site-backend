db = require("../db/connection");
fs = require("fs/promises");
const path = `./endpoints.json`;

function fetchTopics() {
  let sqlGet = "SELECT * FROM topics;";
  return db.query(`${sqlGet}`).then(({ rows }) => {
    return rows;
  });
}

function fetchAPI() {
  return fs.readFile(path, "utf8").then((data) => {
    return data;
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

module.exports = {
  fetchTopics,
  fetchAPI,
  fetchArticle,
  fetchArticles,
};
