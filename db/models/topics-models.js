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

module.exports = { fetchTopics, fetchEndpoints }