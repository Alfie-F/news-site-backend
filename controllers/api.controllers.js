function getAPI(req, res, next) {
  const path = `./endpoints.json`;
  return fs
    .readFile(path, "utf8")
    .then((data) => {
      let parsedData = { api: JSON.parse(data) };
      res.status(200).send(parsedData);
    })
    .catch(next);
}

module.exports = { getAPI };
