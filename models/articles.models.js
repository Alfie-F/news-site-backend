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
  const valid = [
    "desc",
    "asc",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_img_url",
    "article_id",
  ];

  function validColumn(sort_by, valid) {
    return valid.some((valid) => sort_by.startsWith(valid));
  }
  let column;
  let split;
  if (sort_by && validColumn(sort_by, valid)) {
    split = sort_by.split("_");
    column = split[0];
    sort_by = split[1];
    order = split[2];
  }

  const validQueries = ["mitch", "cats", "paper", "icellusedkars"];
  if (sort_by && !validQueries.includes(sort_by)) {
    return Promise.reject({ status: 403, msg: "topic does not exist" });
  }
  let sqlQuery =
    "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
  if (validQueries.includes(sort_by)) {
    sqlQuery += ` WHERE articles.${column} = '${sort_by}'`;
  }
  sqlQuery += " GROUP BY articles.*, articles.article_id, comments.article_id ";
  if (column !== "asc" && column !== "desc") {
    if (!column) {
      sqlQuery += `ORDER BY created_at `;
    } else {
      sqlQuery += `ORDER BY ${column} `;
    }
  }

  if (!sqlQuery.includes("ORDER BY")) {
    sqlQuery += `ORDER BY created_at `;
  }

  if (split && split[split.length - 1] === "asc") {
    sqlQuery += "ASC;";
  } else {
    sqlQuery += "DESC;";
  }
  return db.query(sqlQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no articles exist for topic",
      });
    } else return rows;
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

module.exports = {
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkForArticle,
  sendComment,
  updateArticle,
};
