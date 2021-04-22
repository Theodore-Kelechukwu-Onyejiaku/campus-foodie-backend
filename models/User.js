const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {type: String},
    given_name : {type: String},
    family_name : {type: String},
    provider: {type: String},
    email: {type: String},
    picture: {type: String},
    googleId: {type: String, select: false}
})

module.exports = mongoose.model("User", userSchema);