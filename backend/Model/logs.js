const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bloodRequestLogSchema = new Schema({
    patientName: {
        type: String,
        required: true,
    },
    bloodType:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    nearestHospital:{
        type: String,
        required: true,
    },
    note: String,
    phone: String,
    quantity: Number,
    requester_username: String,
    request_date:String,
    donator_username: String,
    done_date: String,
    done: Boolean,
});

module.exports = mongoose.model('bloodRequestsLogs',bloodRequestLogSchema);