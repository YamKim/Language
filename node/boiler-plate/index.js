const express     = require('express') // express 모듈 가져오기
const app         = express()
const port        = 3000

const bodyParser  = require('body-parser')
// bodyParser가 client로부터 오는 정보를 server에서 분석해서 가지고 오도록.
// application/x-www-form-urlendcoded로 된 것을 분석 
app.use(bodyParser.urlencoded({extended: true}))
// application/json 타입으로 된 것을 분석해서 가지고 오도록
app.use(bodyParser.json())

const mongoose  = require('mongoose')
const config    = require('./config/key')
var connectSuccesMsg = 'MongoDB connected...'
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log(connectSuccesMsg))
  .catch(err => console.log(err))

// express 앱의 루트 디렉토리에 send message 띄우기.
app.get('/', (req, res) => {
  res.send('Hello World!')
})

const { User } = require("./models/User")
// callback function: request, response
// register louter라고 부름.
app.post('/register', (req, res) => {
  // 회원 가입 시 필요한 정보들을 client에서 가져오면, 이를 데이터 베이스에 넣어줌.
  // req.body: json 형식의 데이터로 클라이언트의 정보를 받아줌(body-parser)
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return (res.json({ sucess: false, err }))
    // stats(200)은 성공한 경우를 의미
    return (res.status(200).json({ sucess: true }))
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

