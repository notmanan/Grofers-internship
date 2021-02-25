const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')

/**
* Convert a "YYYY-MM-DD" String into a Date datatype
@param {String} str (The string in "YYYY-MM-DD" format)
@return {Date} date (the date as a Date datatype)
*/
function convertDate(str){
  var parts = str.split("-")
  var date = new Date(parts[0],parts[1],parts[2])
  return date
}

/**
* Returns the time difference in weeks between two Dates.
@oaram {Date} dt2 ()
@oaram {Date} dt2 ()
@return {float} (Difference in weeks)
*/
function diff_weeks(dt2, dt1){
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7);
  return Math.abs((diff));
}

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
    if(event.winner == null){ // Check to make sure that the event has not already ended
      if(nextE == null){
        minDate = convertDate(event.date)
        nextE = event
      }else{
        tryDate = convertDate(event.date)
        if(tryDate < minDate){ // To find the minimum date: locates the first upcoming event
          minDate = tryDate
          nextE = event
        }
      }
    }
  }
  return nextE // Returns null if an appropriate next event is not found.
}

/**
* GET API call to recieve all events saved in database
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: GET http://localhost:8000/events/all
*/
router.get('/all', async(req, res) => {
  console.log("GET view all raffle draw events. ")
  try{
      const events = await Event.find()
      res.json(events)
  }catch(err){
    res.send("GET all events error:  " + err)
  }
})

/**
* GET API call to return single event by 1D
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: GET http://localhost:8000/events/id/<id>
*/
router.get('/id/:id', async(req, res) =>{
  console.log(req.params.id)
  try{
    const event = await Event.findById(req.params.id) // Obtain event by ID
    res.json(event)
  }catch(err){
    res.send("GET event by id error:  " + err)
  }
})

/**
* POST API call to create a new event
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: POST http://localhost:8000/events/add
{
  "date" : "2020-10-02" (required)
  "reward" : "iPhone 12" (defaulted to "2000 Rupees")
}
*/
router.post('/add', async(req,res) => {
  console.log("POST create new raffle draw event. ")
  const  event = new Event({
    date: req.body.date,
    reward: req.body.reward,
    enrolledUsers: req.body.enrolledUsers,
    winner: req.body.winner
  })

  try{
    const tempEvent = await event.save()
    res.json(tempEvent)
  }catch(err){
    res.send('POST new event error:' + err)
  }
})

/**
* GET API call to return next upcoming event
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: GET http://localhost:8000/events/nextEvent
*/
router.get('/nextEvent', async(req, res) => {
  try{
      // const events = await Event.find()
      var ne = await nextEvent() // Obtain the next upcoming event
      if(ne){
        res.json(ne)
      }else{
        res.send("No upcoming raffle draw.")
      }
  }catch(err){
    res.send("GET all events error:  " + err)
  }
})

/**
* PATCH API call to choose a winner for the upcoming event
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: PATCH http://localhost:8000/events/nextEvent
*/
router.patch('/declareEvent', async(req, res) => {
  console.log("PATCH choose a winner for the upcoming event. ")
  try{
      var ne = await nextEvent() // Obtain the next upcoming event
      if(ne){ // Check that there *is* a viable upcoming event
        var participants = ne.enrolledUsers
        if((participants).length > 0){ // Check that there is atleast one participant in the event
          const winner = participants[Math.floor(Math.random() * participants.length)] // Randomly choose winner from array
          ne.winner = winner // Assign winner
          await ne.save() // Save winner
          res.json(await User.findById(winner))
        }else{
          res.send("No Users in Event. ")
        }
      }else{
        res.send("No event to declare. ")
      }
  }catch(err){
    res.send("PATCH declare event error:  " + err)
  }
})

/**
* GET API call to return all winners in the last week
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: GET http://localhost:8000/events/week
*/
router.get('/winners', async(req, res) =>{
  console.log("GET printing winners this week. ")
  try{
    var events = await Event.find()
    var winners = []
    for( i = 0 ; i < events.length ; i++){
      var event = events[i]
      // console.log(diff_weeks(convertDate(event.date), new Date(Date.now())))
      if(event.winner != null && diff_weeks(convertDate(event.date), new Date(Date.now()))<=1){
        var winnerName = (await User.findById(event.winner)).name
        winners.push({"Name":winnerName, "Date": event.date, "Reward": event.reward})
      }
    }
    res.json(winners)

  }catch(err){
    res.send("GET winners from last week:  " + err)
  }
})

module.exports = router
