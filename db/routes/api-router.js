const { getEndpoints, getTopics } = require("../controllers/topics-controllers");
const { getUsers } = require("../controllers/users-controllers");

const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")
const usersRouter = require("./users-router")

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter)

apiRouter.use("/users", usersRouter)

apiRouter.get("/", getEndpoints)

apiRouter.get("/topics", getTopics)

apiRouter.all("*", (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

module.exports = apiRouter