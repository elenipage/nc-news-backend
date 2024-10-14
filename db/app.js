const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers")

app.get("/api/topics", getTopics)

app.use("/api/*", (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'internal server error'})
})

module.exports = app;