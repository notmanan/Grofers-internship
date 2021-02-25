const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Event = require('../models/event')

router.get('/', async(req, res) => {
  console.log("GET all users.")
  try{
      const users = await User.find()
      res.json(users)
  }catch(err){
    res.send("GET all users error:  " + err)
  }
})

router.get('/:id', async(req, res) =>{
  console.log("GET user by id.")
  try{
    const user = await User.findById(req.params.id)
    res.json(user)
  }catch(err){
    res.send("GET user by id error:  " + err)
  }
})

router.patch('/:id/newRaffle', async(req, res) =>{
  console.log("PATCH add new raffle.")
  try{
    const user = await User.findById(req.params.id)
    user.numberOfRaffleCoupons +=1
    const tempUser = await user.save()
    res.json(tempUser)
  }catch(err){
    res.send("GET user by id error:  " + err)
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

router.patch('/:id/enrollRaffle', async(req, res) =>{
  console.log("PATCH Enroll User Raffle")
  try{
    const user = await User.findById(req.params.id)
    const nextE = await nextEvent()
    console.log(nextE)
    if(user.numberOfRaffleCoupons > 0 &&  !nextE.enrolledUsers.includes(user.id)){
      console.log("Hi")
      user.numberOfRaffleCoupons -= 1
      nextE.enrolledUsers.push(user.id)
      const tempEvent = await nextE.save()
      const tempUser = await user.save()
      res.json(tempUser)
    }else{
      res.send("null")
    }

    // user.numberOfRaffleCoupons +=1
    // const tempUser = await user.save()
    // res.json(tempUser)
  }catch(err){
    res.send("GET user by id error:  " + err)
  }
})

router.post('/', async(req,res) => {
  console.log("POST new user.")
   const  user = new User({
     name: req.body.name,
     password: req.body.password,
     email: req.body.email,
     numberOfRaffleCoupons: req.body.numberOfRaffleCoupons
   })

   try{
     const tempUser = await user.save()
     res.json(tempUser)
   }catch(err){
     res.send('POST new user error:' + err)
   }
})

module.exports = router
