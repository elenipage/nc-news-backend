const { deleteComment, commentVotes } = require("../controllers/comments-controllers");
const comments = require("../data/test-data/comments");

const commentsRouter = require("express").Router()

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)
    .patch(commentVotes)

commentsRouter.all("*", (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

module.exports = commentsRouter;