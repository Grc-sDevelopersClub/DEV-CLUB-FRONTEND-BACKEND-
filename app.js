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
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
const methodOverride = require("method-override");
const crypto = require("crypto");
const fs = require("fs");
 
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

//     Middleware

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/devclubDB",{
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const mongoURI="mongodb://localhost:27017/devclubDB";

const conn = mongoose.createConnection(mongoURI,{
  useUnifiedTopology: true,
  useNewUrlParser: true
});


mongoose.set("useCreateIndex", true);

//init GridFs
let gfs; 


conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

//cretate storage engine

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

const userDetails = new mongoose.Schema({
  name: String,
  password: String,
  facebookId: String,
  googleId: String,
  imageUrl: {
    type: String,
  },
  username: String,
});
const fileSchema = new mongoose.Schema({
  fileName: String,
  department: String,
  yearOfStudy: String,
  semester: String,
  subject: String,
  unit: Number,
  path: String,
});

userDetails.plugin(passportLocalMongoose);
userDetails.plugin(findOrCreate);

const Details = new mongoose.model("Detail", userDetails);
const File = new mongoose.model("File", fileSchema);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Details.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      Details.findOrCreate(
        { googleId: profile.id },
        {
          username: profile.emails[0].value,
          googleId: profile.id,
          name: profile.displayName,
          imageUrl: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/secrets",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      Details.findOrCreate(
        { facebookId: profile.id },
        {
          username: profile.emails[0].value,
          facebookId: profile.id,
          name: profile.displayName,
          imageUrl: `https://graph.facebook.com/${profile.id}/picture?access_token=${accessToken}`,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);



app.get("/", (req, res) => {
  res.render("index");
});
let editorLang = "python";

app.get("/online-compiler", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("online-compiler", {
      language: editorLang,
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })(req, res, next);
});

app.post("/online-compiler", (req, res) => {
  editorLang = req.body.Lang;
  res.render("online-compiler", {
    language: editorLang,
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/secrets",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);

app.get("/profile", async (req, res) => {
  // res.render("profile");
  if (req.isAuthenticated()) {
    // materialArray = File.find({}).toArray();
    res.render("profile", {
      name: req.user.name,
      imageUrl: req.user.imageUrl,
      email: req.user.username,
      // studymaterial: materialArray,
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  console.log("You are logged out");
  res.redirect("/login");
});

// app.post("/profile",(req,res)=>{

// });

app.get("/store", (req, res) => {

  if (req.isAuthenticated()) {
    res.render("store");
  } else {
    res.redirect("/login");
  }
  
});


app.get("/files",(req,res)=>{
    gfs.find().toArray((err,files)=>{
      //check if files exist
    if(!files||files.length === 0){
      return res.status(404).json({
        err:"No Files Exist"
      });
    }
    return res.json(files);
  });
});



app.get("/files/:fileName",(req,res)=>{

  gfs.find({filename : req.params.fileName}).toArray((err,file)=>{
    //check if files exist
  if(!file[0]||file.length === 0){
    return res.status(404).json({
      success:false,
      message:"No Files Available"
    });
  }
  if(file[0].contentType === "image/jpeg" || file[0].contentType === "application/pdf"|| file[0].contentType === "image/jpg" || file[0].contentType ==="image/png"){
    gfs.openDownloadStreamByName(req.params.fileName).pipe(res);
  }else{
    res.status(404).json({
      err:"Not an Image",
    })
  }
  // return res.json(file[0]);
});
  
});


app.post("/store", upload.single("file"), (req,res)=>{
  // res.json({file:req.file});
  const file = new File({
    fileName: req.file.filename,
    department: req.body.department,
    yearOfStudy: req.body.yearOfStudy,
    semester: req.body.semester,
    subject: req.body.subject,
    unit: req.body.unit,
    path: "/department/"+req.body.department+"/yearOfStudy/"+req.body.yearOfStudy+"/semester/"+req.body.semester+"/subject/"+req.body.subject+"/unit/"+req.body.unit,
  });
  file.save((err)=>{
    if(!err){
      
      console.log("Sucessfully saved file details");
      res.redirect("/store");
    }else{
      console.log(err);
  
    }
  });
});

// app.get("/files/:id", (req, res) => {
//   var filename = req.params.id;

//   File.findOne({ _id: filename }, (err, result) => {
//     if (err) return console.log(err);

//     res.contentType("application/pdf");
//     //  res.send(result.destination[0]);
//   });
// });

app.get("/donation", (req, res) => {
  res.render("donation");
});

let port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("Server is active on port " + port);
});
