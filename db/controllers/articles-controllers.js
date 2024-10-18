const { fetchArticleById, fetchArticles, patchVotes, insertArticle } = require("../models/articles-models")
const { fetchTopics } = require("../models/topics-models")


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
    const { sort_by, order, topic } = request.query
    
    fetchTopics()
    .then((topics) => {
        return topics.map((validTopic) => {
            return validTopic.slug
        })
    })
    .then((validTopics) => {
        return fetchArticles(sort_by, order, topic, validTopics)
    })
    .then((articles) => {
        response.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
}

const incrementVotes = (request, response, next) => {
    const id = request.params.article_id
    const body = request.body
    const promises = [fetchArticleById(id), patchVotes(body, id)]
    
    Promise.all(promises)
    .then((results) => {
        const article = results[1]
        response.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
    })
}

const postArticle = (request, response, next) => {
    const body = request.body
    insertArticle(body)
    .then((newArticle) => {
        response.status(201).send({article: newArticle})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById, getArticles, incrementVotes, postArticle }