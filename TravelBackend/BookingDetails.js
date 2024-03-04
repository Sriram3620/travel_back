const mongoose = require('mongoose');

const BookingSchema=new mongoose.Schema({
    user:String,
    img:String,
    destination:String,
    price:String,
    type:String,
    time:String,
})

const BookingDetails=mongoose.model('bookingdetails',BookingSchema)
module.exports=BookingDetails