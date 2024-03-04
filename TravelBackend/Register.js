const mongoose = require('mongoose');

const userScheme=new mongoose.Schema({
  name:String,
  password:String,
  email:String,
  jwtToken:String
})

const UserDetails=mongoose.model('userdetails',userScheme)
module.exports=UserDetails