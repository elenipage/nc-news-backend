const { forEach } = require("../data/test-data/articles")
const { fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles } = require("../models/topics-models")


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



module.exports = { getTopics, getEndpoints }