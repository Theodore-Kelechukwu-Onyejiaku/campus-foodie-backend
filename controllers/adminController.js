const async = require("async");
const {cloudinary} = require("../utils/cloudinary")

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
    // const users = await User.find({isAdmin: false}).exec(); 
    const users = await User.find().exec();

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
    console.log(product.categories)
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
        console.log(req.body.categories)
        
        if(req.body.categories.length <= 0){
            const dishCategories = req.body.categories.replace(/\s+/g, '').split(",")
        }else{
            dish.categories = req.body.categories;
        }
        try {
            const updatedDish = await dish.save();
            console.log(updatedDish);
            return res.status(200).json({message: "dish updated successfully!", status:"ok"})
        } catch (error) {
            console.log(error.message)
           return res.status(400).json({message: error.message, status: "fail"});
        }
    })
}

exports.deleteSingleProduct = async (req, res, next) =>{

    try {
        let product = await Dish.findById(req.params.id);
        if(!product){
            return res.status(400).json({message: "No product found!", status:"fail"});
        }
        cloudinary.uploader.destroy(product.imageId, function(error,result) {
            if(error){
                // console.log("Error is :"+JSON.stringify(error))
                return res.status(400).json({message: error, status:"fail"});
            }
            // console.log("result is :"+JSON.stringify(result))
            var delprroduct = Dish.findByIdAndDelete(req.params.id, (error, result)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({message: error, status:"fail"});
                }
                res.status(200).json({status:"ok", product:product, message:"Product deleted successfully!"});

            });
            
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({status:"fail", message: error});
    }    
}

exports.getAllProducts = async(req, res, next)=>{
    try {
        const dishes = await Dish.find({})
        if(dishes == null){
            return res.status(400).json({status:"fail", message: "No product found!"});
        }
        res.status(200).json({status: "ok", products: dishes});
    } catch (error) {
        return res.status(400).json({status:"fail", message: "No product found!"});
    }
}