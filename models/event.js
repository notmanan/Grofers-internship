const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
   date: {
     type: String,
     required: true
   },
   reward: {
     type: String,
     required: true,
     default: "2000 Rupees Cashback"
   },
   enrolledUsers: {
     type: [String],
     required: false
   },
   winner: {
     type: String,
     required: false,
     default: null
   }
} )

module.exports =  mongoose.model('Event', eventSchema)
