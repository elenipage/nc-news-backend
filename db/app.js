const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics-controllers")
const { getArticleById, getArticles, incrementVotes} = require("./controllers/articles-controllers")
const { getCommentsById, postCommentById, deleteComment } = require("./controllers/comments-controllers")
const { getUsers } = require("./controllers/users-controllers")

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsById)

app.post("/api/articles/:article_id/comments", postCommentById)

app.patch("/api/articles/:article_id", incrementVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.use("/api/*", (req, res) => {
    res.status(404).send({ msg: 'Not Found'})
})

app.use((err,req,res,next)=>{
    if(err.code==="23502" || err.code==='22P02'){
        res.status(400).send({msg: 'Bad Request'})
    }
    else{
        next(err)
    }
})

app.use((err,req,res,next) => {
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'internal server error'})
})

module.exports = app;