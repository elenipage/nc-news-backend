const { fetchArticleById, fetchArticles, fetchCommentsById, insertCommentById } = require("../models/articles-models")


const getArticleById = (request, response, next) => {
    const id = request.params.article_id
    fetchArticleById(id)
    .then((article) => {
        response.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}

const getArticles = (request, response, next) => {
    fetchArticles()
    .then((articles) => {
        response.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
}

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

module.exports = { getArticleById, getArticles, getCommentsById, postCommentById }