const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const item = new Schema({
    name: {type: String},
    quantity: {type: Number},
    price: {type: Number}  
})
const Order = new Schema({
    customer : {type: Schema.Types.ObjectId, ref: "User"},
    deliveryAgent: {type: Schema.Types.ObjectId, ref: "User"},
    deliveryStatus : {type: String, enum: ["pending","delivered", "canceled"], default: "pending"},
    amount: {type: String},
    products: [item],
    destination: {type: String},
    customerConfirmation: {type: Boolean},
    deliveryAgentConfirmation: {type: Boolean},
    done: {type: Boolean, default: false}
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Order", Order)