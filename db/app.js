const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router")

app.use(express.json())

app.use("/api", apiRouter)

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