const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Define Schema
const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    profilepic: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Person = mongoose.model("myPerson", PersonSchema);