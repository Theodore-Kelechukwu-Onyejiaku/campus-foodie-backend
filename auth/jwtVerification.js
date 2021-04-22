const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyUser = (req, res, next)=>{
    var token = req.body.token;
    console.log(token)
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err, token_data)=>{
            if(err){
                res.status(400).json({message:"You are not authenticated. Please log in!"});
                return;
            }else{
                req.userId = token_data
                next();
            }
        })
    }else{
        res.status(400).json({message:"Please login in!!!"});
        return;
    }
}

exports.verifyAdmin = (req, res, next)=>{
    if(req.user.admin){
      return  next()
    }
    var err = new Error("You are not authorized!");
    err.status = 403;
    res.render("signin", {error: err});
}