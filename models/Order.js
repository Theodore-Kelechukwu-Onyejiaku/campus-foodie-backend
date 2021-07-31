const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
    customer : {type: Schema.Types.ObjectId, ref: "User"},
    deliveryAgent: {type: Schema.Types.ObjectId, ref: "User"},
    deliveryStatus : {type: String, enum: ["pending","delivered", "canceled"]},
    amount: {type: Number},
    product: [{type: String}]
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Order", Order)