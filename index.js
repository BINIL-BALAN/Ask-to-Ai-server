const express = require('express');
require("dotenv").config();
const app = express()
const cors = require('cors')
const { Configuration, OpenAIApi } = require('openai')
const service = require('./service/dataservice')
const jwt = require('jsonwebtoken')

//token varification
const jwtToken = (req, res, next) => {
    const token = req.headers['access-token']
    try {
        console.log('inside jwtfunction')
        const getResult = jwt.verify(token,'AsktoAITOkenverification#9633507930_')
        req.email = getResult.email
        next()
    } catch {
        console.log('verify failed')
        result = {
            statusCode: 401,
            message: "Please login"
        }

        res.status(result.statusCode).json(result)
    }
}


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:4200'
}))

const configuration = new Configuration({
    apiKey:process.env.OPEN_AI_KEY
})
const openai = new OpenAIApi(configuration)

app.listen(3000, () => {
    console.log(`srever started at 3000`);
})

// let question = "what is programming language"
app.post('/registration',(req,res)=>{
    console.log('inside register post');
    service.register(req.body).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/login',(req,res)=>{
    service.login(req.body.email,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

app.get('/ask/:question',jwtToken, async (req, res) => {
    console.log('request received')
    let question = req.params.question
    service.askQuestion(question,req,openai).then((result) => {
        res.status(result.statusCode).json(result)
    })
})

app.get('/get-questions',jwtToken,(req,res)=>{
    console.log('inside requesting');
     service.getQuestionArray(req).then((result)=>{
        res.status(result.statusCode).json(result)
     })
})

app.delete('/delete-all-chats',jwtToken,(req,res)=>{
    service.deleteAllChats(req).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

app.delete('/delete-one-chat/:index',jwtToken,(req,res)=>{
    console.log('delete one chat');
   let index = req.params.index
    service.deleteOneChat(req,index).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

app.get('/try-demo/:question',async (req, res) => {
    console.log('request received')
    let question = req.params.question
    service.tryDemo(question,openai).then((result) => {
        res.status(result.statusCode).json(result)
    })
})


