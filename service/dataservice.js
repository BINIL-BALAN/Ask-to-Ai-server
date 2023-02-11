const db = require('./db')
const jwt = require('jsonwebtoken')
const register = (user) => {
    console.log('inside register function');
    return db.User.findOne({ email: user.email,password:user.password }).then((result) => {
        if (result) {
            console.log('inside checking');
            return {
                statusCode: 401,
                message: "Account already exist"
            }
        } else {
            let newUser = new db.User({
                username: user.username,
                email: user.email,
                password: user.password,
                questions: []
            })
            newUser.save()
            return{
                statusCode:200,
                message:"Registration successfull"
            }
        }
    })
}

const login = (email,password) => {
    return db.User.findOne({ email,password }).then((result) => {
        if (result) {
            let token = jwt.sign({ email:email },'AsktoAITOkenverification#9633507930_')
            return {
                statusCode: 200,
                message: 'login successfull',
                username: result.username,
                token
            }
        } else {
            return {
                statusCode: 400,
                message: "Invalid credinals"
            }
        }
    })
}

const askQuestion = async (question,req,openai) => {
   let errorMsg = ''
  db.User.findOne({email:req.email}).then((result)=>{
    if(result){
        result.questions.unshift(question)
        result.save()
    }else{
        errorMsg = "Something went wrong please login again"
    }
    
  })
    try {
        console.log('requesting')
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${question}###`,
            max_tokens: 64,
            temperature: 0,
            top_p: 1.0
        })
    
        return {
            statusCode:200,
            dberrorMsg:errorMsg,
            answer: response.data.choices[0].text
        }
    } catch (error) {
        return {
            statusCode:400,
            message:error.response ? error.response.data:'There is an issue in server'
        }
    }
}

const getQuestionArray=(req)=>{
   return db.User.findOne({email:req.email}).then((result)=>{
          if(result){
                return{
                    statusCode: 200,
                    questions:result.questions
                }
          }else{
             return {
                statusCode: 400,
                message: "Something went wrong please login again"
             }
          }
   })
}
module.exports = {
    askQuestion,
    register,
    login,
    getQuestionArray
}