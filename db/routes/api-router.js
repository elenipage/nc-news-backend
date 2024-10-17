const { getEndpoints, getTopics } = require("../controllers/topics-controllers");
const { getUsers } = require("../controllers/users-controllers");

const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter)

apiRouter.get("/", getEndpoints)

apiRouter.get("/topics", getTopics)

apiRouter.get("/users", getUsers)

apiRouter.all("*", (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

module.exports = apiRouter