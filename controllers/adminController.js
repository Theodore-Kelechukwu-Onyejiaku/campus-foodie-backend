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

exports.getSingleUser = async (req, res, next) =>{
    const user = await User.findById(req.params.id).select("-password").exec();
    if(!user){
        return res.status(400).json({message: "No user found!", status:"fail"});
    }
    res.status(200).json({status:"ok", user:user});
}

exports.getSingleProduct = async (req, res, next) =>{
    const product = await Dish.findById(req.params.id);
    if(!product){
        return res.status(400).json({message: "No product found!", status:"fail"});
    }
    res.status(200).json({status:"ok", product:product});
}

exports.updateSingleProduct = async (req, res, next)=>{
    const formBody = req.body;
    Dish.findByIdAndUpdate({_id : req.params.id}, 
        {name: req.body.name, price: req.body.price, description: req.body.description}, 
        async(err, dish)=>{

        if(err){
           return res.status(400).json({message: err, status: "fail"});
        }
        if(dish === null) {
            return res.status(400).json({message: "No product found!", status:"fail"});
        }
        console.log(req.body)
        

        // var isSame = (req.body.categories.length == dish.categories.length) && req.body.categories.every(function(el, ind){
        //     return el === dish.categories[ind]
        // })
        // if(!isSame){
        //     return res.status(200).json({message: "dish updated successfully!"})
        // }
        const dishCategories = req.body.categories.replace(/\s+/g, '').split(",");
        dish.categories = dishCategories;
        try {
            const updatedDish = await dish.save();
            return res.status(200).json({message: "dish updated successfully!"})
        } catch (error) {
           return res.status(400).json({message: err, status: "fail"});
        }
    })
}

exports.deleteSingleProduct = async (req, res, next) =>{
    const product = await Dish.findByIdAndRemove(req.params.id);
    if(!product){
        return res.status(400).json({message: "No product found!", status:"fail"});
    }
    res.status(200).json({status:"ok", product:product});
}