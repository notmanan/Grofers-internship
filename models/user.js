const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    default: "1234abcd"
  },
  email: {
    type: String,
    required: true,
  },
  numberOfRaffleCoupons: {
    type: Number,
    required: false,
    default: 0
  }
})

module.exports =  mongoose.model('User', userSchema)
