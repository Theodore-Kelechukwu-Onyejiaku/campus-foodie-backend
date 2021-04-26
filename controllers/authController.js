const passport = require("passport");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../auth/jwtVerification");
require("dotenv").config();


// VERIFY IF USER IS LOGGED IN
exports.verifyLogin = async (req, res, next)=>{
    try {
      let user = await User.findById(req.user._id, "email username").exec()
      if(user.isActivated == false){
        return res.status(400).json({message:"Your account is not activated. Please check your email and activate it.", user:user, isAuthenticated:true, isActivated: false})
      }
      res.status(200).json({message:"You are logged in!", user:user, isAuthenticated:true, isActivated: true})
    } catch (error) {
      res.status(400).json({message:error.message});
    }
}

// SIGNUP VIA GOOGLE
exports.googleSignUp = async (req, res, next) => {
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
      picture: picture,
      isActivated: true
    })
  
    const newUser = await user.save();
    const newToken = jwt.sign(newUser.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '5m' });
              
    res.status(201).json({message: "User created successfuly", token : newToken, user:newUser, accountActivated: true});
  }

// LOCAL SIGN UP
exports.localSignup = async (req, res, next) =>{
    if(req.body === ""){
      return res.status(400).json({message:"No email and password present", token: false})
    }
    let userEmail = await User.findOne({ email: req.body.email });
    
    // If email exists
    if(userEmail){
      console.log(userEmail)
       return res.status(400).json({message:"Account already exists!", token: false})
    }

    let salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let newUser = new User({
      email: req.body.email,
      password: hashPassword,
      provider: "local"
    })

    await newUser.save()
    const newToken = jwt.sign(newUser.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '5m' });
    res.status(201).json({message: "User created successfuly", token : newToken, user:newUser, isActivated: false});
}


// ACCOUNT ACTIVATION
