const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')

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

function diff_weeks(dt2, dt1)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7);
  return Math.abs((diff));

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

router.patch('/declareEvent', async(req, res) => {
  try{
      // const events = await Event.find()
      var ne = await nextEvent()
      if(ne){
        var participants = ne.enrolledUsers
        if((participants).length > 0){
          const winner = participants[Math.floor(Math.random() * participants.length)]
          ne.winner = winner
          await ne.save()




          res.json(await User.findById(winner))
        }else{
          res.send("No Users in Event. ")
        }
      }else{
        res.send("No event to declare. ")
      }
  }catch(err){
    res.send("GET all events error:  " + err)
  }
})

// router.get('/:id', async(req, res) =>{
//   try{
//     const event = await Event.findById(req.params.id)
//     res.json(event)
//   }catch(err){
//     res.send("GET event by id error:  " + err)
//   }
// })

router.get('/winners', async(req, res) =>{
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
    console.log("xyxa")
    res.send("GET xxxx from last week:  " + err)
    console.log("xyx")
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
