const db = require("../connection")
const fs = require("fs/promises")

const fetchEndpoints = () => {
    return fs.readFile(`endpoints.json`, 'utf8', (err, data) => {return data})
    .then((data) => {
        return JSON.parse(data)
    })
}

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

const fetchArticle = (id) => {
    return db.query(`SELECT * FROM articles
        WHERE article_id = $1`, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Not Found'})
            }
            return rows[0]
        })
}

module.exports = { fetchTopics, fetchEndpoints, fetchArticle }