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

module.exports = { fetchTopics, fetchEndpoints }