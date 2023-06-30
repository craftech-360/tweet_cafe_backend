const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id : {
        type:String
    },
    text : {
        type:String
    },
    userName : {
        type:String
    },
    image:{
        type:String
    },
    isServing:{
        type:String
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = User;