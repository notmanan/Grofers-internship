const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/GrofersRaffleDraw'

const app = express()

mongoose.connect(url, {userNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
  console.log("Connected.")
})

app.use(express.json())

const userRouter = require('./routes/users')
app.use('/users', userRouter)
const eventRouter = require('./routes/events')
app.use('/events', eventRouter)

app.listen(8000, () => {
  console.log("Server Started.")
})
