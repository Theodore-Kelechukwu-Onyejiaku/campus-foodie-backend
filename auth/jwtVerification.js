const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.verifyUser = (req, res, next)=>{
    // var token = req.body.token;
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err, token_data)=>{
            if(err){
                console.log("not authenticated")
                res.status(400).json({message:"You are not authenticated. Please log in!", isAuthenticated:false});
                return;
            }else{
                req.userId = token_data.user_id
                next();
            }
        })
    }else{
        console.log("please login")
        res.status(400).json({message:"Please login!!!"});
        return;
    }
}

exports.verifyAdmin = async (req, res, next)=>{
    const user =await  User.findById({_id: req.userId});
    if(user.isAdmin){
        next();
    }else{
        res.status(403).json({message: "You are not authorized!", status: "fail"})
    }
}