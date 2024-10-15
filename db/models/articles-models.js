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

const fetchArticles = () => {
    return db.query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count 
    FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = { fetchArticleById, fetchArticles }