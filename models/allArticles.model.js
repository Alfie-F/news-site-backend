function fetchArticlesALL(queries, topics) {
  const allValid = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_img_url",
    "article_id",
  ];

  let queryFor = "";
  validTopics = topics.map((topic) => {
    return topic.slug;
  });
  badTop = false;
  //validRequest and validTopic checker
  categories = Object.keys(queries);
  requests = Object.values(queries);
  categories.forEach((cat) => {
    if (allValid.includes(cat)) {
      if (!validTopics.includes(requests[categories.indexOf(cat)])) {
        badTop = true;
      } else
        queryFor = `WHERE articles.${cat} = '${
          requests[categories.indexOf(cat)]
        }' `;
    }
  });
  // validation for sort_by searches
  let filterBy = "created_at";
  if (categories.includes("sort_by")) {
    if (allValid.includes(requests[categories.indexOf("sort_by")])) {
      filterBy = requests[categories.indexOf("sort_by")];
    } else badTop = true;
  }

  // validation for asc/desc
  let orderBy = "DESC";
  if (categories.includes("order")) {
    if (
      requests[categories.indexOf("order")] === "asc" ||
      requests[categories.indexOf("order")] === "desc"
    ) {
      orderBy = requests[categories.indexOf("order")];
    } else badTop = true;
  }

  //pagination - limit
  let limitBy = 10;
  if (categories.includes("limit")) {
    if (Number(requests[categories.indexOf("limit")]) >= 0) {
      limitBy = Number(requests[categories.indexOf("limit")]);
    } else badTop = true;
  }

  //pagination - Page
  let page = 0;
  if (categories.includes("p")) {
    if (Number(requests[categories.indexOf("p")]) >= 0) {
      page = Number(requests[categories.indexOf("p")]);
    } else badTop = true;
  }

  if (badTop) {
    return Promise.reject({ status: 403, msg: "topic does not exist" });
  }

  const sqlQuery = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ${queryFor} GROUP BY articles.*, articles.article_id ORDER BY ${filterBy} ${orderBy} LIMIT ${limitBy} OFFSET ${page};`;

  return db.query(sqlQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no articles exist for topic",
      });
    } else return rows;
  });
}

function totalArticles() {
  return db.query("SELECT COUNT(*) FROM articles").then(({ rows }) => {
    return rows[0].count;
  });
}

module.exports = { fetchArticlesALL, totalArticles };
