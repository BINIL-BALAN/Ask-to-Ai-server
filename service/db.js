const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
require("dotenv").config();

mongoose.connect(process.env.DATABASE_CONNECTION,()=>{
    console.log("MongoDB connected successfully");
})

const User = mongoose.model('User',{
    username:String,
    email:String,
    password:String,
    questions:[]
})

module.exports={
    User
}