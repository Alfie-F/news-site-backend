function fetchTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
}

function sendTopic(topicBody) {
  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *",
      [topicBody.slug, topicBody.description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  fetchTopics,
  sendTopic,
};
