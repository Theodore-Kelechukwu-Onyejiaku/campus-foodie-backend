const async = require("async");

const User = require("../models/User");
const Dish = require("../models/Dish");

exports.getDashboard = (req, res, next)=>{
    async.parallel({
        users: function(callback) {
            User.count({"isAdmin":false}, callback);
        },
        dishes: function(callback) {
            Dish.count({}, callback);
        },
    }, function(err, results) {
        if (err) { 
            return res.status(400).json({"error": "something went wrong!"});
        }

        return res.status(200).json({users: results.users, dishes: results.dishes})
    });
}

exports.getAllUsers = async (req, res, next) =>{
    const users = await User.find({isAdmin: false}).exec();

    res.status(200).json({users: users})
}