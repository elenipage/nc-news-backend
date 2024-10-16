const format = require("pg-format")
const db = require("../connection")

const fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}

const fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}

module.exports = { fetchUsers, fetchUserByUsername }