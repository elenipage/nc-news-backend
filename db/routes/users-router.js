const { getUsers, getUserByUsername } = require("../controllers/users-controllers");

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)

usersRouter
    .route("/:username")
    .get(getUserByUsername)

module.exports = usersRouter;