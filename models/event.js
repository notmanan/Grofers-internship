const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
   date: {
     type: Date,
     required: true
   },
   reward: {
     type: String,
     required: true
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
