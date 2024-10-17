const { fetchUsers, fetchUserByUsername } = require("../models/users-models")

const getUsers = (request, response, next) => {
    fetchUsers()
    .then((users) => {
        response.status(200).send({users: users})
    })
    .catch((err) => {
        next(err)
    })
}

const getUserByUsername = (request, response, next) => {
    const { username } = request.params
    fetchUserByUsername(username)
    .then((user) => {
        response.status(200).send({user: user})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getUsers, getUserByUsername }