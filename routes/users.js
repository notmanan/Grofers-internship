const express = require('express')
const router = express.Router()
const User = require('../models/user')

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
