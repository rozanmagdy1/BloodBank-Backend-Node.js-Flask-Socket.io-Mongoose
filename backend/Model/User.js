const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bloodType:{
        type: String,
        required: true,
    },
    isAdmin: Boolean,
    age: Number,
    address: String,
    nationalId: String,
    gender: String,
    phone: String,
    verified: Boolean,
});

module.exports = mongoose.model('users',UserSchema);