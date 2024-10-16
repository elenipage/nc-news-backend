const format = require("pg-format")
const db = require("../connection")

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

const fetchArticles = (sort_by = 'created_at', order = 'DESC') => {
    const validSortBy = [ 'created_at', 'article_id', 'author', 'title', 'topic', 'votes', 'article_img_url', 'comment_count' ]
    const validOrder = ['ASC','DESC']
    
    if(!validSortBy.includes(sort_by) || !validOrder.includes(order.toUpperCase())) {
        return Promise.reject({status : 400, msg: 'Bad Request'})
    }
    
    let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count 
    FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id
    GROUP BY articles.article_id`

    queryStr += ` ORDER BY ${sort_by}`
    queryStr += ` ${order.toUpperCase()}`

    return db.query(queryStr)
    .then(({rows}) => {
        return rows
    })
}

const patchVotes = (body, id) => {
    const { inc_votes } = body
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *`, [inc_votes, id])
    .then(({rows}) => {
        return rows[0]
    })
}

module.exports = { fetchArticleById, fetchArticles, patchVotes }