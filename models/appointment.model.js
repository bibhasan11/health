const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    department:{
        required:true,
        type:String,
    },
    doctors : {
        required: true,
        type: String
    },
    date : {
        required:true,
        type: String
    },
    time : {
        required:true,
        type: String
    },
    doctorName : {
        type : String
    },
    phone:{
        type:String,
        required:true,
    },
    username : {
        type : String
    },
    isVerify:{
        type:Number,
        default:0,
    },
    link:{
        type:String,
        default:""
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = { Appointment};