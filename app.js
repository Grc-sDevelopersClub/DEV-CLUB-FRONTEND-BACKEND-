require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require("mongoose-findorcreate");
var path = require("path");
const multer = require("multer");







const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/devclubDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String

});

const userDetails = new mongoose.Schema({
  firstName: String,
  lastName: String,
  contact: String,
  email: String,

});
const fileSchema = new mongoose.Schema({
  department: String,
  yearOfStudy: String,
  semester: Number,
  subject: String,
  unit: String,
  destination: [String]
});






userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Details = new mongoose.model("Detail", userDetails);
const File= new mongoose.model("File",fileSchema);



passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({
        googleId: profile.id
      }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);



passport.use(
  new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/secrets",
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({
        facebookId: profile.id
      }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

const store = (req,res,next)=>{
  let uploadedFile = new File({
    department:req.body.department,
    yearOfStudy: req.body.yearOfStudy,
    sem: req.body.sem,
    subject: req.body.subject,
    unit: req.body.unit,
    
  })
  let filePath=[];
  if(req.files){
    filePath=[];
      req.files.forEach((file,index,array)=>{
        
         filePath.push(path +file.path +","); 
      })
      uploadedFile.destination = filePath
      
  }
  uploadedFile.save()
  .then(response =>{
      res.json({
          message:"File Added Sucessfully"
      })
  })
  .catch(err =>{
      res.json({
          message:"An error occured"
      })
  })
};

app.get("/", (req, res) => {
  res.render("index");
});
let editorLang = "python";
app.get("/online-compiler", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("online-compiler", {
      language: editorLang
    });
  } else {
    res.redirect("/login");
  }


});

app.get("/register", (req, res) => {
  res.render("register");
});




app.post("/register", (req, res) => {


  User.register({
      username: req.body.username,
      name: req.body.firstName
    },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/profile");
        });
      }
    },
  );
  const userDetail = new Details({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.username,

  });

  userDetail.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sucessfully save details");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        
          res.redirect("/profile");
      
      });

    }
  });
});

app.post("/online-compiler", (req, res) => {
  editorLang = req.body.Lang;
  res.render("online-compiler", {
    language: editorLang
  });
});



app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/secrets",
  passport.authenticate("facebook", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);
app.get("/profile", (req, res) => {
  
  
  if (req.isAuthenticated()) {
    Details.findOne({email:req.user.username},(err,user)=>{
      if(!err){
        const fullName=user.firstName+" "+ user.lastName;
        const email=user.email;
        res.render("profile",{name:fullName,mail:email});
      }
    });
  } else {
    res.redirect("/login");
  }

  
});

app.post("/profile",(req,res)=>{
  console.log(req);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
    cb(null,Date.now() + ext)
  }
});

const upload = multer ({
  storage: storage,
  fileFilter: (req,file,callback)=>{
      if(file.mimetype="application/pdf"){
          callback(null,true);
      }else{
          console.log("Only PDF formats are allowed");
          callback(null,false);
      }
  },
  limits: {
      fileSize: 10485760 
  }
})


app.post("/store", upload.array("destination[]") , store);

app.post("/profile",(req,res)=>{
  console.log(req);
});




app.get("/donation", (req, res) => {
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

let port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("Server is active on port " + port);
});
