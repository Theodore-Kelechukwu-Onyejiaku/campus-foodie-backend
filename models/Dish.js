const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Dish =  new Schema({
    name: {type: String},
    description: {type: String},
    categories: [],
    price: {type: String},
    dishUrl: {type: String}
})

module.exports = mongoose.model("Dish", Dish);