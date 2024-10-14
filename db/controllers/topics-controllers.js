const { fetchTopics, fetchEndpoints, fetchArticleById } = require("../models/topics-models")


const getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics)=>{
        response.status(200).send(topics)
    })
    .catch((err) => {
        next(err)
    })
}

const getEndpoints = (request, response, next) => {
    const endpoints = fetchEndpoints()
    response.status(200).send(endpoints)
    .catch((err) => {
        next(err)
    })
}

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

module.exports = { getTopics, getEndpoints, getArticleById }