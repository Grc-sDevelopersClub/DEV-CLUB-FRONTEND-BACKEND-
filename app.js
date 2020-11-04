
require('dotenv').config()
const express= require ("express");
const bodyParser= require ("body-parser");
const Razorpay =require("razorpay");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLoacalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var findOrCreate = require("mongoose-findorcreate");


const app = express();

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/devclubDB",{
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String
});

const User = new mongoose.model("User",userSchema);

// passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


app.get("/",(req,res) => {
    res.render("index");
});

app.get("/online-compiler",(req,res) =>{
    res.render("online-compiler",{language:editorLang});
});
let editorLang="python";
app.post("/online-compiler",(req,res) =>{
    editorLang =req.body.Lang;
    res.render("online-compiler",{language:editorLang});
});


app.get("/register",(req,res) =>{
    res.render("register");
});

app.post("/register",(req,res)=>{

});

app.get("/donation",(req,res) =>{
    res.render("donation");
});


// <---------------- Donation Page ------------------>

// let instance = new Razorpay({
//     key_id:process.env.RAZORPAY_ID, // your `KEY_ID`
//     key_secret: process.env.RAZORPAY_SECRET // your `KEY_SECRET`
//   })
  
//   app.use(bodyParser.json());


//   app.post("/api/payment/order",(req,res)=>{
//   params=req.body;
//   instance.orders.create(params).then((data) => {
//          res.send({"sub":data,"status":"success"});
//   }).catch((error) => {
//          res.send({"sub":error,"status":"failed"});
//   })
//   });
  
  
  
  
//   app.post("/api/payment/verify",(req,res)=>{
//   body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
//   var crypto = require("crypto");
//   var expectedSignature = crypto.createHmac('grc_sr',process.env.RAZORPAY_SECRET )
//                                   .update(body.toString())
//                                   .digest('hex');
//                                   console.log("sig"+req.body.razorpay_signature);
//                                   console.log("sig"+expectedSignature);
//   var response = {"status":"failure"}
//   if(expectedSignature === req.body.razorpay_signature)
//    response={"status":"success"}
//       res.send(response);
//   });
  

// <---------------- Donation Page ------------------>

  
  let port= process.env.PORT || 3000 ;

  app.listen(port, (req,res) => {
      console.log("Server is active on port "+port);
  } );
  