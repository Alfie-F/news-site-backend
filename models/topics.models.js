db = require("../db/connection");

function fetchTopics() {
  let sqlGet = "SELECT * FROM topics;";
  return db.query(`${sqlGet}`).then(({ rows }) => {
    return rows;
  });
}

module.exports = { fetchTopics };
