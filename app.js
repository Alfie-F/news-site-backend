const express = require("express");
const app = express();
const api = require("./routes/api-router.js");
app.use("/api", api);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg }, "<---");
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    return res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503")
    return res.status(404).send({ msg: "article does not exist" });
  else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ msg: "you should not see this error message" });
});

module.exports = app;
