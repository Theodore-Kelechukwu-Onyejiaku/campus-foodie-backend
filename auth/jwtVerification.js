const jwt = require("jsonwebtoken");
require("dotenv").config();

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

exports.verifyAdmin = (req, res, next)=>{
    // if(req.user.admin){
    //   return  next()
    // }
    // console.log("You are not authorized!")
    // var err = new Error("You are not authorized!");
    // err.status = 403;
    // res.render("signin", {error: err});
    next()
}