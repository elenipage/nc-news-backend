const { forEach } = require("../data/test-data/articles")
const { fetchArticleById, fetchArticles } = require("../models/articles-models")

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

module.exports = { getArticleById, getArticles }