const Dish = require("../models/dish");
const {cloudinary} = require("../utils/cloudinary")

exports.getDishes = async (req, res, next)=>{
    const dishes = await Dish.find({})
    if(dishes === null){
       res.status(400).json({"message": "null"});
       return;
    }

    return res.status(200).json({"dishes": dishes});
}

exports.addDish =  async (req, res, next)=>{
    try {
        const dish = new Dish({
            name: req.body.dishName,
            price: req.body.price,
            description: req.body.description,
        })

        const dishCategories = req.body.categories.replace(/\s+/g, '').split(",");
        dish.categories= dishCategories;
    
        const picture = req.body.dishPicture;
        const uploadResponse = await cloudinary.uploader.upload(picture, {upload_preset: "campus-foodie"})
    
        dish.dishUrl = uploadResponse.url;
        
        const newDish = await dish.save();
        const hmm = await Dish.find({});
        res.status(200).json({message: "Dish Upload Successful!", dish:newDish})
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
    
}