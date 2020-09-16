// 배포 후에 비밀 정보를 넣는 경로
if (process.env.NODE_ENV == 'production') {
    module.exports = require('./prod')
} 
// 개발시 비밀 정보를 넣는 경로
else {
    module.exports = require('./dev')
}