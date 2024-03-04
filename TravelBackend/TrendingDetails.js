const mongoose = require('mongoose');

const TrendingSchema=new mongoose.Schema({
    imgUrl:String,
    destination:String,
    description:String,
    offerimg:String
})

const TrendingDetails=mongoose.model('trendingdetails',TrendingSchema)
module.exports=TrendingDetails