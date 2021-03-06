const passport = require("passport");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../auth/jwtVerification");
require("dotenv").config();

const {makeString} = require("../helpers/randStringGen");
let sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);


// VERIFY IF USER IS LOGGED IN
exports.verifyLogin = async (req, res, next)=>{
  console.log(req.userId)
    try {
      let user = await User.findById(req.userId)
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
  console.log("hemmmm")
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
    
    const verificationString = await makeString(10); 

    const user = new User({
      fullname: name,
      given_name: given_name,
      family_name: family_name,
      provider:"google",
      email:email,
      googleId: sub,
      picture: picture,
      isActivated: true,
    })
  
      const newUser = await user.save();
      const newToken = jwt.sign({user_id: newUser._id}, process.env.TOKEN_SECRET, {  expiresIn: '59m' });
              
      return res.status(200).json({message: "User created successfuly", token : newToken, user:newUser, accountActivated: true});
  }


  // LOGIN VIA GOOGLE
exports.googleLogin = async (req, res, next) => {
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
    const newToken = jwt.sign({user_id: oldUser._id}, process.env.TOKEN_SECRET, {  expiresIn: '59m' });
            
    res.status(200).json({message: "Login Successful", token : newToken, user:oldUser, accountActivated: true});
  }

  console.log("Account does not exist")
  return res.status(400).json({message:"Account does not exist. Please create an account!", token: false})

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
    const verificationString = await makeString(10); 

    console.log(req.body.fullname)

    let user = new User({
      email: req.body.email,
      fullname: req.body.fullname,
      password: hashPassword,
      provider: "local",
      isActivated: false,
      verificationSign: verificationString
    })

    const protocol = req.protocol;
    const host = req.get("host");
    const link = `${protocol}://${host}/api/auth/activate/${user.verificationSign}/${user._id}`
    const emailContent = "Please click the link below to verify your account";
    
    console.log("The user email is: "+user.email)
    const msg = {
      to: user.email,
      from: "theodore.onyejiaku.g20@gmail.com", // Use the email address or domain you verified above
      subject: "Email Activation",
      text: "Sending email activation",
      //html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      html: `<body>
                <h1  style='font-family:Tangerine, cursive'>Welcome to Campus Foodie</h1>
                
                <div style='background-color:blue;padding:'>
                    <p>${emailContent}</p>
                    <a href="${link}"><button style="background-color:#ee6e73;border:none;outline:none;color:white;padding:2%;cursor:pointer">Verify Account</button></div>
                </div>
                <footer></footer>
            </body>
            `
    };
    sgMail.send(msg).then(
      async (resp) => {
        console.log("response from sendgrid is:"+ resp);
        const newUser = await user.save();
        if(!newUser){
          return res.status(400).json({message:"Something went wrong", token: false})
        }
        console.log("Sent Successfully")
        const newToken = await jwt.sign({user_id: newUser._id}, process.env.TOKEN_SECRET, {  expiresIn: '59m' });
        console.log(link);
        return res.status(200).json({message: "User created successfuly", token : newToken, user:newUser, accountActivated: true});
      },
      (error) => {
        console.error(error);
          console.log("SOmething went wrong actually")
        return res.status(400).json({message:"Something went wrong", token: false})
      }
    );
    
}


//LOCAL LOGIN
exports.localLogin = async (req, res, next) =>{
  console.log(req.body)
  if(!req.body){
    console.log("no request body!")
    return res.status(400).json({message:"No email and password present", token: false,isActivated:false})
  }

  //Find if email exists
  let ourUser = await User.findOne({ email: req.body.email });
  console.log(ourUser);

  if(!ourUser){
    return res.status(400).json({message:"Account does not exist", token: false,isActivated:false})
  }

  //Find if user is google or any social auth user
  if(ourUser.provider !== "local"){
    console.log("You already have a provider account")
    return res.status(400).json({message:`You already have a ${ourUser.provider} account. Please login with it.`, token: false, isActivated:false})
  }

  // If email exists
  if(ourUser.isActivated){
     var passwordCorrect = await bcrypt.compare(req.body.password, ourUser.password);
     console.log("is password correct?:"+passwordCorrect)
     console.log(req.body.password)
     if(passwordCorrect){
        const newToken = jwt.sign({user_id: ourUser._id}, process.env.TOKEN_SECRET, {  expiresIn: '59m' });
        return res.status(200).json({message: "Login successful", token : newToken, user:ourUser, isActivated: true});
     }
    return res.status(400).json({message:"Incorrect password!", token: false,isActivated:false})
  }else{
    return res.status(400).json({message:`You are yet to activate account. Please check your email and activate your account`, token: false, isActivated:false})
  }

  return res.status(400).json({message:"Account does not exist!", token: false,isActivated:false})
  
}

// ACTIVATE USER ACCOUNT
exports.activateAccount =async (req, res, next) =>{
  console.log(req.get("host"));
  console.log(req.protocol);

  const user = await User.findById(req.params.userId).exec();

  if(!user){
    return res.render("email-activation",{error:"Account does not exist!"})
  }
  if(user.isActivated){
    return res.render("email-activation", {message: "This account is already activated!"})
  }

  if(user.verificationSign === req.params.userSignature){
    user.isActivated = true;
    await user.save();
  }
  return res.render("email-activation", {message: "Account activation successful!"})
}


// RESET PASSWORD
exports.getPasswordResetCode = async (req, res, next) =>{
  const user = await User.findOne({email: req.params.email}).exec();

  if(!user){
    return res.status(403).json({status: "fail", message: "email not found!"});
  }
  if(user.provider === "local"){
    const tokenExpiration = Date.now() + 1800000; // 30 mins expiration
    const resetCode = await makeString(30);
    const protocol = req.protocol;
    const host = req.get("host");
    const link = `${protocol}://${host}/api/auth/password-reset/${resetCode}/${user._id}`
    const emailContent = "Please click the button below to reset your password";
    
    const msg = {
      to: user.email,
      from: "theodore.onyejiaku.g20@gmail.com", // Use the email address or domain you verified above
      subject: "Password Recovery",
      text: "Password Recovery Link",
      html: `<body>
                <h1  style='font-family:Tangerine, cursive'>Welcome to Campus Foodie</h1>
                
                <div style='background-color:blue;padding:'>
                    <p>${emailContent}</p>
                    <a href="${link}"><button style="background-color:#ee6e73;border:none;outline:none;color:white;padding:2%;cursor:pointer">Reset Password</button></div>
                </div>
                <footer></footer>
            </body>
            `
    };
    sgMail.send(msg).then(
      async (resp) => {
        user.passwordResetCode = resetCode;
        user.passwordTokenExpiration = tokenExpiration;
        const newUser = await user.save();
        if(!newUser){
          return res.status(400).json({message:"Something went wrong", token: false})
        }
        console.log("Sent Successfully")
        console.log(link);
        return res.status(200).json({message: "Password Sent Successfully", status:"ok"});
      },
      (error) => {
        console.error(error);
          
        return res.status(400).json({message:"Something went wrong", status:"fail"})
      }
    );
    

  }else{
    res.status(400).json({status:"fail", message: `Please login with your ${user.provider} account`})
  }
}


exports.getPasswordUser = async (req, res, next) =>{
  try {
    const user = await User.findById(req.params.userId).exec();
    if(!user){
      res.render("passwordReset",{status:"fail", error: `User not found!`})
    }
  
    if(user.passwordResetCode === req.params.resetCode){
      if(user.passwordTokenExpiration === ""){
        res.render("passwordReset",{status: "fail", error: "link has expired or has been used"})
      }
      
      if(Date.now() - Number(user.passwordTokenExpiration) > 300000){ //If it is greater than the expiration time
        res.render("passwordReset",{status: "fail", error: "link has expired!"})
      }else{
        res.render("passwordReset",{status: "ok", message:"User found", user: user});
      }
  
    }else{
      res.render("passwordReset",{status: "fail", error: "Invalid password recovery link!"})
    }  
  } catch (error) {
    console.log(error.message);
    res.render("passwordReset",{status: "fail", error: "Something went wrong"});
  }
}

exports.changePassword = async (req, res, next) =>{
  try {
    console.log(req.body)
    const user = await User.findById(req.body.userId).exec();
    console.log(user);
    

    if(!user){
      res.status(404).json({status: "fail", message: "No user found!"})
      return;
    }
    const isResetCodeValid = user.passwordResetCode == req.body.resetCode;


    if(!isResetCodeValid){
      res.status(404).json({status: "fail", message: "Something went wrong"})
      return;
    
    }
  
    let salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
  
    user.password = hashPassword;
    user.passwordResetCode = ""
  
    const modifiedUser = await user.save();
    res.status(200).json({status: "ok", message:"Password reset successful!"}); 
  } catch (error) {
    console.log(error.message)
    res.status(404).json({status: "fail", message: "Something went wrong!"})
  }
}