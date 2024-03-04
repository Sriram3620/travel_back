const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const UserDetails=require("./Register")
const TrendingDetails=require("./TrendingDetails")
const BookingDetails=require("./BookingDetails")
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const app=express()
const jwt=require("jsonwebtoken")
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
// app.use(bodyParser.json());
mongoose.connect("mongodb+srv://sriram3:sriram2004@cluster0.ec9nano.mongodb.net/Travel",{ useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post("/register",async(req,res)=>
{
    const {name,email}=req.body;
    let {password}=req.body
     password=await bcrypt.hash(password,10);
     const checkUser=await UserDetails.findOne({email})
     if(checkUser===null)
     {
         const payload = {
             userMail: email,
           };
           const jwtToken = jwt.sign(payload, "SR_123");
           res.status(200);
           res.send({ jwtToken });
           const newData=await new UserDetails({name,password,email,jwtToken})
         const saved=await  newData.save()
     }
      else{
         res.send("userAlreadyExist")
      }
})

app.post("/login",async(req,res)=>
{
    const {email,password}=req.body
    const User=await UserDetails.findOne({email})
    if(User===null)
    {
        res.send("Invalid User");
    }
    else 
    {
      const isPasswordMatch=await bcrypt.compare(password,User.password)
      if(isPasswordMatch)
      {
        jwt.verify(User.jwtToken, "SR_123", async (error, payload) =>
        {
          if(error)
          {
            res.send("Invalid AccessToken")
          }
          else {
            res.send({Token:User.jwtToken,userName:payload.userMail})
          } 
        })
        
      }
      else 
      {
        res.send("Password is Incorrect")
      }
    }
})

app.post("/trendingdetails",async(req,res)=>
{
  const data=req.body
  const newData=await new TrendingDetails(req.body)
  const saved=await  newData.save()
  res.sendStatus(204); 
})

app.get("/trendingdetails",async(req,res)=>
{
  
  const data= await TrendingDetails.find({})
   res.send(data)
})

app.put("/trendingupdate/:id",async(req,res)=>
{
  const {id}=req.params
  const data=req.body
  const updatedItem = await TrendingDetails.findByIdAndUpdate(id, {...data}, { new: true });
  res.send(updatedItem)
  
})

app.get("/yourbookings/:id",async(req,res)=>
{
   const {id}=req.params
   const user=id
   const data=await BookingDetails.find({user})
   res.send(data)
})

app.delete("/yourbookings/:id",async(req,res)=>
{
  try {
    const { id } = req.params;
    await BookingDetails.findByIdAndDelete(id);
    res.sendStatus(204); 
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.delete("/trendingdelete/:id",async(req,res)=>
{
  try {
    const { id } = req.params;
    await TrendingDetails.findByIdAndDelete(id);
    res.sendStatus(204); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.get("/adminuserdata",async(req,res)=>
{
  const data= await UserDetails.find({})
   res.send(data)
})


app.get("/dashboard",async(req,res)=>
{
    const data=await BookingDetails.find({})
    res.send(data)
})



app.post("/bookingdetails",async(req,res)=>
{
  const data=req.body
  const newData=await new BookingDetails(req.body)
  const saved=await  newData.save()
  res.sendStatus(204); 
})

app.listen(3001,()=>{
    console.log("Server is Running");
})