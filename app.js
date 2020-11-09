require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require("mongoose-findorcreate");
var path = require("path");
const multer = require("multer");

const fs=require("fs");


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


const userDetails = new mongoose.Schema({
  name: String,
  password:String,
  facebookId:String,
  googleId:String,
  imageUrl:{
    type:String},
  username:String

});
const fileSchema = new mongoose.Schema({
  fileName:String,
  department: String,
  yearOfStudy: String,
  semester: String,
  subject: String,
  unit: Number,
  destination: [String]
});

userDetails.plugin(passportLocalMongoose);
userDetails.plugin(findOrCreate);


const Details = new mongoose.model("Detail", userDetails);
const File= new mongoose.model("File",fileSchema);



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Details.findById(id, function(err, user) {
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
     
      Details.findOrCreate({googleId: profile.id},{  
        username:profile.emails[0].value,
        googleId: profile.id,
        name:profile.displayName,
        imageUrl:profile.photos[0].value   
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
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
      Details.findOrCreate({facebookId: profile.id},{
        username:profile.emails[0].value,
        facebookId: profile.id,
        name:profile.displayName,
        imageUrl:`https://graph.facebook.com/${profile.id}/picture?access_token=${accessToken}` 

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
      console.log("File Added Sucessfully");
      res.redirect("/store");
  })
  .catch(err =>{
      console.log( "An error occured");
    
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

});

app.get("/login", (req, res) => {
  res.render("login");
});



app.post("/login", (req, res,next) => {

  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })(req, res,next);


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
    scope: ["profile","email"]
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook",{ scope : ['email'] }));

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

app.get("/profile", async(req, res) => {

  // res.render("profile");
if(req.isAuthenticated()){
  materialArray=File.find({}).toArray();
  res.render("profile",{name:req.user.name,imageUrl:req.user.imageUrl,email:req.user.username,studymaterial:materialArray});
}else{
  res.redirect("/login");
}

  
});


app.get('/logout', (req, res) => {
  req.logout();
  console.log('You are logged out');
  res.redirect('/login');
});

// app.post("/profile",(req,res)=>{
 
// });

app.get("/store",(req,res)=>{
       res.render("store");
  
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/uploads/')
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


app.post("/store", upload.array("destination") , store);

app.get('/files/:id', (req, res) => {
  var filename = req.params.id;
   
  File.findOne({'_id': filename }, (err, result) => {
    
      if (err) return console.log(err)
   
     res.contentType('application/pdf');
    //  res.send(result.destination[0]);
    
      
    })
  })

app.get("/donation", (req, res) => {
  res.render("donation");
});


let port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("Server is active on port " + port);
});
