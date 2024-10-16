const { fetchUsers } = require("../models/users-models")

const getUsers = (request, response, next) => {
    fetchUsers()
    .then((users) => {
        response.status(200).send({users: users})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getUsers }