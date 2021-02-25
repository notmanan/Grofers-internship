const express = require('express')
const router = express.Router()
const Event = require('../models/event')

router.get('/', async(req, res) => {
  try{
      const events = await Event.find()
      res.json(events)
  }catch(err){
    res.send("GET all events error:  " + err)
  }
})

function convertDate(str){
  var parts = str.split("-")
  var date = new Date(parts[0],parts[1],parts[2])
  return date
}

async function nextEvent(){
  const events = await Event.find()
  var nextE = null
  var minDate = null
  for(i = 0 , len = events.length; i < len; i++){
    var event = events[i]
    if(event.winner == null){
      if(nextE == null){
        minDate = convertDate(event.date)
        nextE = event
      }else{
        tryDate = convertDate(event.date)
        if(tryDate < minDate){
          minDate = tryDate
          nextE = event
        }
      }
    }
  }
  return nextE
}

router.get('/nextEvent', async(req, res) => {
  try{
      // const events = await Event.find()
      var ne = await nextEvent()
      res.json(ne)
  }catch(err){
    res.send("GET all events error:  " + err)
  }
})

router.get('/:id', async(req, res) =>{
  try{
    const event = await Event.findById(req.params.id)
    res.json(event)
  }catch(err){
    res.send("GET event by id error:  " + err)
  }
})

router.get('/winners', async(req, res) =>{
  try{
    const event = await Event.findById(req.params.id)
    res.json(event)
  }catch(err){
    res.send("GET event by id error:  " + err)
  }
})

router.post('/', async(req,res) => {
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

module.exports = router
