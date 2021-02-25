const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Event = require('../models/event')


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
* GET API call to recieve all users saved in database
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: GET http://localhost:8000/users/all
*/
router.get('/all', async(req, res) => {
  console.log("GET all users.")
  try{
      const users = await User.find()
      res.json(users)
  }catch(err){
    res.send("GET all users error:  " + err)
  }
})

/**
* GET API call to recieve user data from database by <id>
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: GET http://localhost:8000/users/id/<id>
*/
router.get('/id/:id', async(req, res) =>{
  console.log("GET user by id.")
  try{
    const user = await User.findById(req.params.id) // Obtain user by ID
    res.json(user)
  }catch(err){
    res.send("GET user by id error:  " + err)
  }
})

/**
* PATCH API to increase the number of raffle coupons a user has by 1
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: PATCH http://localhost:8000/users/<id>/newRaffle
*/
router.patch('/:id/newRaffle', async(req, res) =>{
  console.log("PATCH add new raffle.")
  try{
    const user = await User.findById(req.params.id) // Obtain user by ID
    user.numberOfRaffleCoupons +=1 // Increment count of raffle coupons by 1
    const tempUser = await user.save() // Save data change back into database
    res.json(tempUser)
  }catch(err){
    res.send("PATCH add new raffle error:  " + err)
  }
})

/**
* PATCH API to allow a user to sign up for the upcoming raffle draw event
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: PATCH http://localhost:8000/users/<id>/enrollRaffle
*/
router.patch('/:id/enrollRaffle', async(req, res) =>{
  console.log("PATCH Enroll User Raffle")
  try{
    const user = await User.findById(req.params.id) // Obtain user by ID
    const nextE = await nextEvent() // Obtain next raffle draw event
    console.log(nextE)
    if(user.numberOfRaffleCoupons > 0){ // Check if the user has raffle coupons available to enter an event
      if(!nextE.enrolledUsers.includes(user.id)){ // Check if user has already entered upcoming event
        user.numberOfRaffleCoupons -= 1
        nextE.enrolledUsers.push(user.id)
        const tempEvent = await nextE.save()
        const tempUser = await user.save()
        res.json(tempUser)
      }else{
        res.send("User is already a part of the upcoming raffle draw event.")
      }
    }else{
      res.send("No Raffle Coupons left to use.")
    }
  }catch(err){
    res.send("PATCH Enroll User Raffle error:  " + err)
  }
})

/**
* POST API to create a new user
* Data is sent as a .json response if found successfully
* Error is sent as a .send response if not found, showing an appropriate error.
* Example Call: POST http://localhost:8000/users/<id>/enrollRaffle
{
  "name" : "Manan Gupta" (required)
  "email" : "manan17372@iiitd.ac.in" (required)
  "password" : "testPassword"  (defaulted to "1234abcd", since testing)
}
*/
router.post('/add', async(req,res) => {
  console.log("POST new user.")
   const  user = new User({
     name: req.body.name,
     password: req.body.password,
     email: req.body.email,
     numberOfRaffleCoupons: req.body.numberOfRaffleCoupons
   })
   try{
     const users = await User.find()
     console.log(users)

     var saveFlag = true
     for(i = 0 ; i < users.length ; i++){
       console.log(users[i].email)
       console.log(user.email)
      if(users[i].email == user.email){
        saveFlag = false
        break
      }
     }

     if(saveFlag){ // Check if new user added has a unique email address
       const tempUser = await user.save() // Save user
       res.json(tempUser)
     }else{
       res.send("User Email Already exists. ")
     }
   }catch(err){
     res.send('POST new user error:' + err)
   }
})

module.exports = router
