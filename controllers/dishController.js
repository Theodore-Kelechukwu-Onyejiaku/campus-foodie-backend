const Dish = require("../models/Dish");
const {cloudinary} = require("../utils/cloudinary")

exports.getDishes = async (req, res, next)=>{
    console.log("hmmmm")
    const dishes = await Dish.find({})
    if(dishes === null){
       res.status(400).json({"message": "null", "status":"fail"});
       return;
    }

    return res.status(200).json({"dishes": dishes});
}

exports.addDish =  async (req, res, next)=>{
    try {
        const dish = new Dish({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
        })

        const dishCategories = req.body.categories.replace(/\s+/g, '').split(",");
        dish.categories= dishCategories;
    
        const picture = req.body.dishPicture;
        const uploadResponse = await cloudinary.v2.fileuploader.upload(picture, {upload_preset: "campus-foodie"})
        console.log(uploadResponse);
    
        dish.dishUrl = uploadResponse.url;
        dish.imageId = uploadResponse.public_id;
        
        const newDish = await dish.save();
        const hmm = await Dish.find({});
        res.status(200).json({message: "Dish Upload Successful!", dish:newDish})
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
    
}