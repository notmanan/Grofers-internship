const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Event = require('../models/event')
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
  return nextE // Returns null if an appropriate next event is not found.
}


/**
* GET API call to recieve all users saved in database
*/
router.get('/', async(req, res) => {
  console.log("GET all users.")
  try{
      const users = await User.find()
      res.json(users)
  }catch(err){
    utils.errorHandler(err, req, res)
  }
})

/**
* GET API call to recieve user data from database by <id>
*/
router.get('/:id', async(req, res) =>{
  console.log("GET user by id.")
  try{
    const user = await User.findById(req.params.id).exec()
    res.json(user)
  }catch(err){
    utils.errorHandler(err, req, res,"User not found.")
  }
})

/**
* PUT API to increase the number of raffle coupons a user has by 1
*/
router.put('/:id/newRaffle', async(req, res) =>{
  console.log("PUT add new raffle.")
  try{
    // Obtain user by ID
    const user = await User.findById(req.params.id)
    // Increment count of raffle coupons by 1
    user.numberOfRaffleCoupons +=1
    // Save data change back into database
    const tempUser = await user.save()
    res.json(tempUser)
  }catch(err){
    utils.errorHandler(err, req, res)
  }
})

/**
* Put API to allow a user to sign up for the upcoming raffle draw event
*/
router.put('/:id/enrollRaffle', async(req, res) =>{
  console.log("PATCH Enroll User Raffle: ")
  try{
    // Obtain user by ID
    const user = await User.findById(req.params.id)
    // Obtain next raffle draw event
    const nextE = await nextEvent()
    console.log(nextE)
    // Check if the user has raffle coupons available to enter an event
    if(user.numberOfRaffleCoupons > 0){
      // Check if user has already entered upcoming event
      if(!nextE.enrolledUsers.includes(user.id)){
        user.numberOfRaffleCoupons -= 1
        nextE.enrolledUsers.push(user.id)
        const tempEvent = await nextE.save()
        const tempUser = await user.save()
        res.json(tempUser)
      }else{
        utils.badRequestHandler(req, res, "User is already a part of the upcoming raffle draw event.")
      }
    }else{
      utils.badRequestHandler(req, res, "No Raffle Coupons left to use.")
    }
  }catch(err){
    utils.errorHandler(err, req, res)
  }
})

/**
* POST API to create a new user
*/
router.post('/', async(req,res) => {
  console.log("POST new user.")
   const  user = new User({
     name: req.body.name,
     email: req.body.email,
     numberOfRaffleCoupons: req.body.numberOfRaffleCoupons
   })
   try{
     const users = await User.find()
     var saveFlag = true
     for(i = 0 ; i < users.length ; i++){
       console.log(users[i].email)
       console.log(user.email)
      if(users[i].email == user.email){
        saveFlag = false
        break
      }
     }

     if(saveFlag){
       // Check if new user added has a unique email address
       const tempUser = await user.save()
       // Save user
       res.json(tempUser)
     }else{
       utils.badRequestHandler(req, res, "User Email already exists.")
     }
   }catch(err){
     utils.errorHandler(err, req, res, message)
   }
})

module.exports = router
