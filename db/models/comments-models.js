const db = require("../connection")

const fetchCommentsById = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY created_at DESC`, [id])
    .then(({rows}) => {
        return rows
    })
}

const insertCommentById = (newBody, id) => {
    const { body, author } = newBody
    return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`, [body, author, id])
    .then(({rows}) => {
        return rows
    })
}

const patchCommentVotes = (body, id) => {
    const { inc_votes } = body
    return db.query('SELECT * FROM comments WHERE comment_id = $1;', [id])
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: 'Comment Not Found'
            })
        }
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comments.comment_id = $2 RETURNING *`, [inc_votes, id])
    })
    .then(({rows}) => {
        return rows[0]
    })
}

const deleteCommentById = (id) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1;', [id])
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: 'Comment Not Found'
            })
        }
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id])
    })
}

module.exports = { fetchCommentsById, insertCommentById, deleteCommentById, patchCommentVotes }