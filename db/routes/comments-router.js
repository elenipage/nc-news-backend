const { deleteComment } = require("../controllers/comments-controllers");
const comments = require("../data/test-data/comments");

const commentsRouter = require("express").Router()

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)

commentsRouter.all("*", (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

module.exports = commentsRouter;