const db = require("../connection")
const endpoints = require("../../endpoints.json")

const fetchEndpoints = () => {
        return endpoints
}

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

const fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles
        WHERE article_id = $1`, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Not Found'})
            }
            return rows[0]
        })
}

module.exports = { fetchTopics, fetchEndpoints, fetchArticleById }