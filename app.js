const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics.controller.js");

app.get("/api/topics", getTopics);

app.use((request, response, next) => {
  response.status(404).send({ msg: "Endpoint Not Found" });
});
module.exports = app;
