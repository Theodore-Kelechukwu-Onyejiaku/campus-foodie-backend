const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    isActivated: {type:Boolean, default: false},
    isAdmin: {type: Boolean, default :false},
    password:{type:String},
    fullname: {type: String},
    given_name : {type: String},
    family_name : {type: String},
    provider: {type: String},
    email: {type: String},
    picture: {type: String},
    googleId: {type: String, select: false},
    verificationSign: {type:String},
    orders: [{type: Schema.Types.ObjectId, ref: "Order"}],
    payments: [{type: Schema.Types.ObjectId, ref: "Payment"}],
    passwordResetCode: {type:String},
    passwordTokenExpiration: {type: String}
})

module.exports = mongoose.model("User", userSchema);