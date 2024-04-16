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

module.exports = { fetchTopics, fetchAPI };
