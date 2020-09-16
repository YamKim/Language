// User모델 만들기
// mongoose 모듈 가져오기
const mongoose = require('mongoose');


// 로그인할 때 사용할 수 있는 정보들을 지정.
// mongoose를 이용하여 schema 생성
const userSchema = mongoose.Schema({
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

// 참고 사이트: https://www.npmjs.com/package/bcrypt
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
        bcrypt.genSalt(saltRounds, function (err, salt) {        
            // err가 나는 경우 next로 (next는 save가 될 것.)
            if (err) return (next(err))
            // 순수하게 clent로부터 받는 비밀번호를 hash 함수로 암호화
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return (next(err))
                // hash된 비밀번호로 바꾸어서 데이터베이스에 저장.
                user.password = hash
                next()
            })
        })
    }
})

// model은 schema를 감싸주는 역할을 함.
// 모델 이름과 모델의 schema를 매개변수로함.
const User = mongoose.model('User', userSchema)
// 외부 파일에서도 모델을 사용하기 위해 export
module.exports = { User }