function fetchUsers() {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
}

function fetchUser(username) {
  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user does not exist" });
      } else return rows[0];
    });
}

module.exports = {
  fetchUsers,
  fetchUser,
};
