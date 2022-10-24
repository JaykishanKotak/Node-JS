const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
        //Linked the schema to Person Schema
    },
    username: {
        type: String,
        required: true,
        max: 20
    },
    website: {
        type: String,
    },
    country: {
        type: String
    },
    //For Programing Languages in form of array of string
    languages: {
        type: [String],
        required: true
    },
    portfolio: {
        type: String
    },
    //Array of Objects
    workrole: [{
        role: {
            type: String,
            required: true
        },
        position: {
            type: String
        },
        company: {
            type: String
        },
        country: {
            type: String
        },
        from: {
            type: Date
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        details: {
            type: String
        }
    }],
    //Object of Objects
    social: {
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        twitter: {
            type: String
        },
        whatsapp: {
            type: Number
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model("myProfile", ProfileSchema);