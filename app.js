const express = require("express");
const app = express();
app.use(express.json());
const { getTopics, getAPI } = require("./controllers/topics.controller.js");

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Endpoint Not Found" });
});
module.exports = app;
