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

module.exports = { fetchTopics, fetchAPI, fetchArticle };

// console.log(Number(article_id));
// if (typeof article_id !== "number") {
//   return Promise.reject({ status: 400, msg: "bad request" });
// }
