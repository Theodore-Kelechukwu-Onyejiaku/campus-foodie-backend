const router = require("express").Router();
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const authController = require("../controllers/authController");
const passport = require("passport");
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const jwtAuth = require("../auth/jwtVerification")
require("dotenv").config();



// router.get("/google", passport.authenticate('google', { scope: ['profile'] }));

router.post("/google", async (req, res) => {
  const { token }  = req.body
  console.log(token)
  if(token == undefined){
    console.log("No token sent");
    return res.status(400).json({message:"Some error occured!", token: false});
  }
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  if(!ticket.getPayload){
    console.log("I don't know what happened");
    return res.status(400).json({message:"Some error occured!", token: false});
  }
  const {name, given_name, family_name, email, picture, sub} = ticket.getPayload();   

  // check if user exists
  const oldUser =await User.findOne({"googleId":sub});
  console.log(oldUser);
  if(oldUser != null){
    console.log("Account exits already")
   return res.status(400).json({message:"Account already exists", token: false})
  }

  const user = new User({
    username: name,
    given_name: given_name,
    family_name: family_name,
    provider:"google",
    email:email,
    googleId: sub,
    picture: picture
  })

  const newUser = await user.save();
  const newToken = jwt.sign(newUser.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '5m' });
            
  res.status(201).json({message: "User created successfuly", token : newToken, user:newUser});
})

router.post("/verify", jwtAuth.verifyUser,async (req, res, next)=>{
  try {
    console.log("User request:" +JSON.stringify(req.user))
    let user = await User.findById(req.user._id, "email username").exec()
    res.status(200).json({message:"You are logged in!", user:user, isAuthenticated:true})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:error.message});
  }
})

module.exports = router;