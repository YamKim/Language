const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yamkim:kyh5933@yamkim-db.4ndtl.mongodb.net/<dbname>?retryWrites=true&w=majority0', {
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hi, Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

