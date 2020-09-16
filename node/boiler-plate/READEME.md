# Nodejs 배우기

## 설치 및 시작 (wsl2 기준)
[참고 페이지](#https://docs.microsoft.com/ko-kr/windows/nodejs/setup-on-wsl2)

Nodejs란? 원래 브라우저에서만 사용하던 자바스크립트를 서버 사이드에서 사용할 수 있는 언어라고 한다. express js는 nodejs를 쉽게 사용할 수 있도록 하는 프레임워크라고 한다.

1. nvm 설치하기 
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash (혹은 zsh)
    ```
2. 설치 확인하기
    ```
    $ nvm --version : 노드 버전 확인
    ```
3. Node.js 최신 릴리즈 설치
    ```
    $ nvm install node : nodejs설치
    $ nvm install -lts : 안정적인 최신 LTS릴리즈 설치
    $ nvm ls : 현재 설치된 노드 버전 나열
    ```
4. 

## 기본 예제 사용해보기(Hello World!)
1. 프로젝트 폴더 생성하기
2. 프로젝트 폴더에서 nodejs 시작하기
    ```javascript
    $ npm init: 패키지를 만드는 명령어로 package.json 생성
    * File: pacakage.js(초기파일)
    {
      "name": "boiler-plate",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" &&   exit 1"
      },
      "author": "yamkim",
      "license": "ISC",
    }
    ```
3. express js다운받기
    ```javascript
    $ npm install express --save

    * File: pacakge.json (express 추가)
    "dependencies": {
        "express": "^4.17.1"
    }
    ```
    > dependencies에 추가할 수 있는 모듈들은 ./node_modules 디렉터리에 모두 있어서 사용할 수 있다.  
4. main에 표시된대로, index.js 파일 생성하여, [참고문서](#http://expressjs.com/en/starter/hello-world.html)의 내용을 복사한다.
    ```javascript
    * File: index.js
    const express = require('express') // express 모듈 가져오기
    const app = express() // 새로운 express app 만들기
    const port = 3000 // 3000번 포트를 백서버로 두기

    app.get('/', (req, res) => {
      // root 디렉터리에 오면 문자열 출력
      res.send('Hello World!')
    })

    // 5000번 포트에서 앱을 실행
    app.listen(port, () => {      
      console.log(`Example app listening at http:// localhost:${port}`)
    })
    ```
    > Hello World!를 localhost:3000에 출력하는 예제
5. node를 이용하여 index.js를 실행하도록 설정
    ```javascript
    * File: package.json ("start" 추가)
    "scripts": {
        "start": "node index.js"
        "test": "echo \"Error: no test  specified\" &&   exit 1"
    }
    ```
6. 서비스 운영
    ```
        $ npm run start
    ```
7. 웹주소에 localhost:3000 주소를 입력하면 내용을 볼 수 있음.

## mongoDB와 연결하기
1. mongoose 설치하기
    ```
    $ npm install mongoose --save
    ```
2. index.js에서 mongoose 연결하기
   mongoDB에서 connect string 복사 후, connect 뒤에 주소 붙이기. (???부분은 비밀번호)
    ```javascript
    * File: index.js
    // DB 연결하기
    const mongoose = require('mongoose')
    var url = 'mongodb+srv://yamkim:kyh5933@cluster0.4ndtl.mongodb.net/<dbname>?retryWrites=true&w=majority'
    var connectSuccesMsg = 'MongoDB connected...'
    // 해당 주소로 연결 후, 연결이 잘 되었는지 확인하기.
    mongoose.connect(url, {
	    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    }).then(() => console.log(connectSuccesMsg))
    .catch(err => console.log(err))  
    ```
3. 서비스 운영
    ```
    $ npm run start
    ```
    위 명령어를 수행하면, mongoDB가 연결되었을 때, 터미널에 log 메세지 "MongoDB Connected..."이라는 문구가 나타남.

## Model 만들기
> Model이란? Client단에서 오는 데이터들을 보관하기 위해 사용하는 도구.  
예를 들어, 로그인 관련 정보의 User 모델을 만들면 ID와 PW, email등의 정보를 갖게됨.  

- Schema, 모델 생성
    ```javascript
    * File: User.js
    // mongoose 모듈 가져오기
    const mongoose = require('mongoose');

    const userSchema = mongoose.Schema({
        // 로그인할 때 사용할 수 있는 정보들을 지정
        name: {
            type: String,
            maxlength: 50
        },
        email: {
            type: String,
            trim: true, // 사이에 공백이 있으면 없애주는 역할을 수행
            unique: 1 // 같은 email을 쓰지 못하도록 세팅
        },
        password: {
            type: String,
            maxlength: 50
        },
        role: { // 관리자와 일반유저를 구분하기 위해 사용
            type: Number,
            default: 0
        },
        image: String,
        token: {
            type: String
        },
        tokenExp: {
            type: Number
        }
    })

    // 모델 이름과 모델의 schema를 매개변수로함.
    const User = mongoose.model('User', userSchema)
    // 외부 파일에서도 모델을 사용하기 위해 export
    module.exports = { User }
    ```

## Client로부터 데이터 받아오기
1. Body-parser dependency 다운받기
    ```javascript
    $ npm install body-parser --save

    * File: packge.json (body-parser 추가)
    "dependencies": {
      "body-parser": "^1.19.0",
      "express": "^4.17.1",
      "mongoose": "^5.10.2"
    },    
    ```
2. postman 다운받기. (client 역할을 해주는 프로그램)
3. index.js에 body-parser 관련 코딩 추가
    ```javascript
    * File: index.js
    const bodyParser  = require('body-parser')

    // client로부터 오는 정보를 서버에서 분석하여 가지고 오도록.
    // application/x-www-form-urlendcoded로 된 것을 분석 
    app.use(bodyParser.urlencoded({extended: true}))
    // application/json 타입으로 된 것을 분석해서 가지고 오도록.
    app.use(bodyParser.json())
    ```
4. index.js에 post method사용
    ```javascript
    * File: index.js
    const { User } = require("./models/User")
    // callback function: request, response
    // register louter라고 부름.
    app.post('/register', (req, res) => {
      // 회원 가입 시 필요한 정보들을 client에서 가져오면, 이를 데이터  베이스에 넣어줌.
      // req.body: json 형식의 데이터로 클라이언트의 정보를 받아줌  (body-parser)
      const user = new User(req.body)

      user.save((err, userInfo) => {
        if(err) return (res.json({ sucess: false, err }))
        // stats(200)은 성공한 경우를 의미
        return (res.status(200).json({ sucess: true }))
      })
    })
    ```
5. postman 프로그램에서 client 정보를 입력하여 "sucess: true" 메시지 확인.

## 실시간으로 service 설정 변경하기
1. Nodemon 설치
    ```javascript
    $ npm install nodemon --save-dev

    * File: packabe.json (nodemon 추가)
    "devDependencies": {
      "nodemon": "^2.0.4"
    }    
    ```
    dev를 붙이면, develope mode로, local에서 작업을 수행할 때만 사용하게 되는 것.
2. Index에서 nodemon을 이용하여 index.js를 실행하도록 설정.
    ```javascript
    "scripts": {
        "start": "node index.js",
        "backend": "nodemon index.js"
        "test": "echo \"Error: no test specified\" && exit 1"
    }
    ```
3. 서비스 운영 후에, index.js의 send 메세지 수정시, 서비스를 끄지 않아도 수정됨.
    ```
    $ npm run backend
    ```

## 숨겨야하는 정보를 다른 모델로 떼어두기
1. 폴더 구성 변경 (config 폴더추가)
    > boiler-plate/  
    > --+index.js  
    > --+package.json  
    > --+models/  
    > --+--+User.js  
    > --+config/  
    > --+--+dev.js  
    > --+--+key.js  
    > --+--+prod.js  

2. config 폴더에 각 js파일 값 아래와 같이 설정
    ```javascript
    // 비밀정보를 넣을 파일
    dev.js:
    module.exports ={
        mongoURI: 'mongodb+srv://yamkim:???@cluster0.4ndtl.mongodb. net/<dbname>?retryWrites=true&w=majority'
    }

    // Heroku site와 같은 배포 사이트 이용시 사용할 경로
    prod.js:
    module.exports = {
        // MONGO_URI는 Heroku 사이트에서 Config Vars에 들어갈 값.
        mongoURI: process.env.MONGO_URI
    }

    key.js:
    if (process.env.NODE_ENV == 'production') {
        module.exports = require('./prod')
    } 
    else {
        module.exports = require('./dev')
    }
    ```
3. index.js에서 수정된 부분 추가하여 모듈을 불러옴.
    ```javascript
    * File: index.js
    const mongoose  = require('mongoose')
    const config    = require('./config/key')
    var connectSuccesMsg = 'MongoDB connected...'
    mongoose.connect(config.mongoURI, {
    	useNewUrlParser: true, useUnifiedTopology: true,    useCreateIndex: true, useFindAndModify: false
    }).then(() => console.log(connectSuccesMsg))
      .catch(err => console.log(err))
    ```
## Bcrypt를 사용하여 비밀번호 암호화
1. bcrypt 라이브러리 설치
    ```
    $ npm install bcrypt --save
    ```
2. 비밀번호 변경은 index.js안에 있는 /regsiter 라우터의 user.save 전에 수행해야 하므로, User.js안에 userSchema에 save 전 수행해야할 함수를 추가한다.
    ```javascript
    // 참고 사이트: https://www.npmjs.com/package/bcrypt
    * File: User.js
    const bcrypt = require('bcrypt')
    const saltRounds = 10 // 암호화를 위한 salt 생성(salt의 글자수)
    // user모델에 user 정보를 'save'하기 전에, function을 수행.
    // 이 작업이 끝나면, next를 수행.
    userSchema.pre('save', function( next ) {
        // user 모델의 값들을 받아온다.
        var user = this;

        // 비밀번호가 변경되는 경우에만 암호화 사용
        if (user.isModified('password')) {
            // 비밀번호를 암호화 시킨다.
            bcrypt.genSalt(saltRounds, function (err, salt)     {        
                // err가 나는 경우 next로 (next는 save가 될 것.)
                if (err) return (next(err))
                // 순수하게 clent로부터 받는 비밀번호를 hash 함수로 암호화
                bcrypt.hash(user.password, salt, function(err,  hash) {
                    if(err) return (next(err))
                    // hash된 비밀번호로 바꾸어서 데이터베이스에 저장.
                    user.password = hash
                    next()
                })
            })
        }
    })
    ```