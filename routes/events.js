const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')
const utils = require('../common/utils')

/**
* Returns the next upcoming raffle draw event
@return {Event} nextE ()
*/
async function nextEvent(){
  const events = await Event.find()
  var nextE = null
  var minDate = null
  for(i = 0 , len = events.length; i < len; i++){
    var event = events[i]
    // Check to make sure that the event has not already ended
    if(event.winner == null){
      if(nextE == null){
        minDate = event.date
        nextE = event
      }else{
        tryDate = event.date
        // To find the minimum date: locates the first upcoming event
        if(tryDate < minDate){
          minDate = tryDate
          nextE = event
        }
      }
    }
  }
  // Returns null if an appropriate next event is not found.
  return nextE
}

/**
* GET API call to recieve all events saved in database
*/
router.get('/', async(req, res) => {
  if(req.query.nextEvent == "True"){
    try{
      /**
      * GET API call to return next upcoming event.
      */
        var ne = await nextEvent()
        if(ne){
          res.json(ne)
        }else{
          utils.badRequestHandler(req, res, "No upcoming raffle draws.")
        }
    }catch(err){
      utils.errorHandler(err, req, res)
    }
  }else if(req.query.winners == "True"){
    /**
    * GET API call to return all winners in the last week
    */

    try{
      var events = await Event.find()
      var winners = []
      for( i = 0 ; i < events.length ; i++){
        var event = events[i]
        // console.log(diff_weeks(convertDate(event.date), new Date(Date.now())))
        if(event.winner != null && utils.diff_weeks(event.date, new Date(Date.now()))<=1){
          var winnerName = (await User.findById(event.winner)).name
          winners.push({"Name":winnerName, "Date": event.date, "Reward": event.reward})
        }
      }
      res.json(winners)
    }catch(err){
      utils.errorHandler(err, req, res)
    }
  }
  else{
    console.log("GET view all raffle draw events. ")
    try{
      const events = await Event.find()
      res.json(events)
    }catch(err){
      utils.errorHandler(err, req, res)
    }
  }
})

/**
* GET API call to return single event by 1D
*/
router.get('/:id', async(req, res) =>{
  console.log(req.params.id)
  try{
    // Obtain event by ID
    const event = await Event.findById(req.params.id)
    res.json(event)
  }catch(err){
    utils.errorHandler(err, req, res)
  }
})

/**
* POST API call to create a new event
*/
router.post('/', async(req,res) => {
  console.log("POST create new raffle draw event. ")
  var dateVar = Date.parse(req.body.date)
  if(!dateVar){
    utils.badRequestHandler(req, res, "Incorrect Date.")
  }
  const  event = new Event({
    date: dateVar,
    reward: req.body.reward,
    enrolledUsers: req.body.enrolledUsers,
    winner: req.body.winner
  })

  try{
    const tempEvent = await event.save()
    res.json(tempEvent)
  }catch(err){
    utils.errorHandler(err, req, res)
  }
})

/*
* PUT call declares a winner for an event by ID
*/
router.put('/:id/declareWinner', async(req, res) => {
  console.log("PUT choose a winner for the upcoming event. ")
  try{
    // Obtain the next upcoming event
      var ne = await Event.findById(req.params.id)
      // Check that there *is* a viable upcoming event
      if(ne){
        var participants = ne.enrolledUsers
        // Check that there is atleast one participant in the event
        if((participants).length > 0){
          // Randomly choose winner from array
          const winner = participants[Math.floor(Math.random() * participants.length)]
          // Assign winner
          ne.winner = winner
          // Save winner
          await ne.save()
          res.json(await User.findById(winner))
        }else{
          utils.badRequestHandler(req, res, "No Users in Event. ")
        }
      }else{
        utils.badRequestHandler(req, res, "No event to declare. ")
      }
  }catch(err){
    utils.errorHandler(err, req, res)
  }
})



module.exports = router
