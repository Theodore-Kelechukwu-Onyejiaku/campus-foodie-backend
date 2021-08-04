const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Payment = new Schema({
    customer: {type: Schema.Types.ObjectId, ref: "User"},
    order: {type: Schema.Types.ObjectId, ref: "Order"},
    name: {type : String},
    email: {type: String},
    phone_number: {type: String},
    transaction_id: {type: String},
    tx_ref : {type: String},
    flw_ref: {type: String},
    currency: {type: String},
    amount: {type: String}
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Payment", Payment); 