const { fetchArticleById } = require("../models/articles-models")
const { fetchCommentsById, insertCommentById, deleteCommentById } = require("../models/comments-models")

const getCommentsById = (request, response, next) => {
    const id = request.params.article_id
    const promises = [fetchArticleById(id), fetchCommentsById(id)]
    
    Promise.all(promises)
    .then((results) => {
        const comments = results[1]
        response.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    })
}

const postCommentById = (request, response, next) => {
    const id = request.params.article_id
    const newBody = request.body
    const promises = [fetchArticleById(id), insertCommentById(newBody, id)]
    
    Promise.all(promises)
    .then((results) => {
        const comment = results[1]
        response.status(201).send({comment: comment[0]})
    })
    .catch((err) => {
        next(err)
    })
}

const deleteComment = (request, response, next) => {
    const id = request.params.comment_id
    deleteCommentById(id)
    .then(() => {
        response.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getCommentsById, postCommentById, deleteComment}