const { getArticles, getArticleById, incrementVotes, postArticle } = require("../controllers/articles-controllers")
const { postCommentById, getCommentsById } = require("../controllers/comments-controllers")
const articlesRouter = require("express").Router()


articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(incrementVotes)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsById)
    .post(postCommentById)

module.exports = articlesRouter;