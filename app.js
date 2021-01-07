
//<----------------------Importing all required modules --------->

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
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");
const checksum_lib = require("./checksum/checksum");
const config = require("./checksum/config");
const flash = require("connect-flash");
const _ = require("lodash");

//Using app as express instance
const app = express();

//setting public folder as default folder for assets
app.use(express.static("public"));

//setting view engine
app.set("view engine", "ejs");





//    connecting  Middleware
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
    // cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());





///------------------creating connection with mongoDB database--------------------->

const mongoURI =
  "mongodb+srv://grc_sr:Western@12@grcs-developers-club.g7k6t.mongodb.net/devclubDB";

const devclubDB = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});

const conn = mongoose.connection;

mongoose.set("useCreateIndex", true);

//initiate  GridFs
let gfs;

conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});





//cretate storage engine tp store gridfs elements

// const storage = new GridFsStorage({
//   db: devclubDB,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

// const upload = multer({ storage });




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
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




//Defining Storage Schemas to use it later

const userDetails = new mongoose.Schema({
  name: String,
  password: String,
  facebookId: String,
  googleId: String,
  imageUrl: {
    type: String,
  },
  username: String,
  department: String,
  year: String,
  sem: String,
  systemAdmin: Boolean,
});


//Schema for storing files


const fileSchema = new mongoose.Schema({
  fileName: String,
  department: String,
  yearOfStudy: String,
  semester: String,
  subject: String,
  unit: Number,
  displayName: String,
});



//using local mongoose plugin for session authentication.

userDetails.plugin(passportLocalMongoose);
userDetails.plugin(findOrCreate);

const Details = new mongoose.model("Detail", userDetails);
const File = new mongoose.model("File", fileSchema);



//Searialise and deserialise passport sessions.

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Details.findById(id, function (err, user) {
    done(err, user);
  });
});




//Defining google and facebook strategy to authenticate using google and facebook auth.

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://gentle-lowlands-90024.herokuapp.com/auth/google/herokuApp",
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
          department: "Enter your Department",
          year: "Enter year of study ",
          sem: "enter semester ",
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
      callbackURL: "https://grcsdevelopersclub.tech/auth/facebook/herokuApp",
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
          department: "Enter your Department",
          year: "Enter year of study ",
          sem: "enter semester ",
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);




//Initialising the routes


//home route for rendering index.js
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/comingsoon",(req,res)=> {
  res.render("comingsoon");
});

//route for handelling  online-compilers.

// let editorLang = "python";
// app.get("/online-compiler", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render("online-compiler", {
//       language: editorLang,
//     });
//   } else {
//     res.redirect("/login");
//   }
// });

// app.post("/online-compiler", (req, res) => {
//   editorLang = req.body.Lang;
//   res.render("online-compiler", {
//     language: editorLang,
//   });
// });



//Register route to register through google and facebook 

app.get("/register", (req, res) => {
  res.render("register");
});


//Login route to login through google and facebook auth
app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});



//Handelling post request after login.
app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })(req, res, next);
});




//Google authentication route sent to google 

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/herokuApp",
  passport.authenticate("google", {
    failureRedirect: "/login"
    // successRedirect: "/profile"
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);





//Facebook authentication using api 

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/herokuApp",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/profile");
  }
);




//Profile route

app.get("/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    // materialArray = File.find({}).toArray();
    res.render("profile", {
      name: req.user.name,
      imageUrl: req.user.imageUrl,
      email: req.user.username,
      department: req.user.department,
      year: req.user.year,
      sem: req.user.sem,
      message: req.flash("message"),
    });
  } else {
    res.redirect("/login");
  }
});



//Profile update route 

app.get("/profileUpdate", (req, res) => {
  if (req.isAuthenticated()) {
    // materialArray = File.find({}).toArray();
    res.render("profileUpdate", {
      name: req.user.name,
      imageUrl: req.user.imageUrl,
      email: req.user.username,
      department: req.user.department,
      year: req.user.year,
      sem: req.user.sem,
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/profileUpdate", (req, res) => {
console.log(req.user);
  Details.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        department: req.body.department,
        year: req.body.yearOfStudy,
        sem: req.body.sem,
        name: req.body.name,
      },
    },
    (err, file) => {
      if (!err) {
        req.flash("message", "Successfully updated profile");
        res.redirect("/profile");
      } else {
        req.flash("message", err);
      }
    }
  );
});





//route for rendering payment interface
app.get("/paynow", (req, res) => {
  res.render("donation");
});

//callback function for paytm payment gateway

app.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = "";

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    var html = "";
    var post_data = qs.parse(body);

    // received params in callback
    console.log("Callback Response: ", post_data, "\n");

    // verify the checksum
    var checksumhash = post_data.CHECKSUMHASH;
    // delete post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(
      post_data,
      config.PaytmConfig.key,
      checksumhash
    );
    console.log("Checksum Result => ", result, "\n");

    // Send Server-to-Server request to verify Order Status
    var params = { MID: config.PaytmConfig.mid, ORDERID: post_data.ORDERID };

    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (
      err,
      checksum
    ) {
      params.CHECKSUMHASH = checksum;
      post_data = "JsonData=" + JSON.stringify(params);

      var options = {
        hostname: "securegw-stage.paytm.in", // for staging
        // hostname: 'securegw.paytm.in', // for production
        port: 443,
        path: "/merchant-status/getTxnStatus",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": post_data.length,
        },
      };

      // Set up the request
      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", function () {
          console.log("S2S Response: ", response, "\n");

          var _result = JSON.parse(response);
          if (_result.STATUS == "TXN_SUCCESS") {
            res.send("payment sucess");
          } else {
            res.send("payment failed");
          }
        });
      });

      // post the data
      post_req.write(post_data);
      post_req.end();
    });
  });
});







//payment handelling route through post paytm.


app.post("/paynow", (req, res) => {
  // Route for making payment

  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.phone,
    customerEmail: req.body.email,
    customerPhone: req.body.phone,
  };
  if (
    !paymentDetails.amount ||
    !paymentDetails.customerId ||
    !paymentDetails.customerEmail ||
    !paymentDetails.customerPhone
  ) {
    res.status(400).send("Payment failed");
  } else {
    var params = {};
    params["MID"] = config.PaytmConfig.mid;
    params["WEBSITE"] = config.PaytmConfig.website;
    params["CHANNEL_ID"] = "WEB";
    params["INDUSTRY_TYPE_ID"] = "Retail";
    params["ORDER_ID"] = "TEST_" + new Date().getTime();
    params["CUST_ID"] = paymentDetails.customerId;
    params["TXN_AMOUNT"] = paymentDetails.amount;
    params["CALLBACK_URL"] = "http://gentle-lowlands-90024.herokuapp.com/callback";
    params["EMAIL"] = paymentDetails.customerEmail;
    params["MOBILE_NO"] = paymentDetails.customerPhone;

    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (
      err,
      checksum
    ) {
      var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
      // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

      var form_fields = "";
      for (var x in params) {
        form_fields +=
          "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
      }
      form_fields +=
        "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' +
          txn_url +
          '" name="f1">' +
          form_fields +
          '</form><script type="text/javascript">document.f1.submit();</script></body></html>'
      );
      res.end();
    });
  }
});





//Route to store all files from the admins.
app.get("/store", (req, res) => {
  res.render("store",{message:req.flash("message")});
  // if (req.isAuthenticated()&& req.user.systemAdmin===true) {
  //   res.render("store",{message:req.flash("message")});
  // } else {
  //   res.redirect("/login");
  // }
});


app.get("/zoom",(req,res)=>{
  res.render("zoom");
});

app.post("/store", upload.single("file"), (req, res) => {
  const file = new File({
    fileName: req.file.filename,
    department: req.body.department,
    yearOfStudy: req.body.yearOfStudy,
    semester: req.body.semester,
    subject: req.body.subject,
    unit: req.body.unit,
    displayName: req.body.displayName,
    message: req.flash("message"),
  });
  file.save((err) => {
    if (!err) {
      req.flash("message", "Sucessfully saved file details");
      res.redirect("/store");
    } else {
      req.flash("message", err);
    }
  });
});



//Logout session trigerring 
app.get("/logout", (req, res) => {
  req.logout();
  req.flash("message", "You are logged out successfully");
  res.redirect("/login");
});




//Finding special file using filename

app.get("/files/:fileName", (req, res) => {
  File.find({fileName: req.params.fileName},(err,data)=>{  
    if(err){  
        console.log(err)  
    }   
    else{
      // console.log(data);  
       var path= __dirname+'/public/uploads/'+data[0].fileName;  
       res.download(path);  
    }  
})  


  //Code for storing in MOnogoDB using grid Fs.



  // gfs.find({ filename: req.params.fileName }).toArray((err, file) => {
  //   //check if files exist
  //   if (!file[0] || file.length === 0) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "No Files Available",
  //     });
  //   }
  //   if (
  //     file[0].contentType === "image/jpeg" ||
  //     file[0].contentType === "application/pdf" ||
  //     file[0].contentType === "image/jpg" ||
  //     file[0].contentType === "image/png"
  //   ) {
  //     gfs.openDownloadStreamByName(req.params.fileName).pipe(res);
  //   } else {
  //     res.status(404).json({
  //       err: "Not an Image",
  //     });
  //   }
  // });


});




//Viewing resources for specific branches.

app.get("/resources", (req, res) => {
  res.render("resources");
  // if (req.isAuthenticated()) {
  //   res.render("resources");
  // } else {
  //   res.redirect("/login");
  // }
});

app.post("/resources", (req, res) => {
  const year = req.body.year;

  const subjectValue = req.body.subject;

  res.render("subject", { subject: subjectValue, yearOfStudy: year });
});



//Finding all resources using unit year and branch.

app.post("/resources/:year/subject/:subject", (req, res) => {
  const year = req.params.year;

  const subjectValue = req.params.subject;
  const unitNo = req.body.unit;

  File.find(
    { subject: subjectValue, unit: unitNo, yearOfStudy: year },
    (err, files) => {
      res.render("material", { files: files });
    }
  );
});



//Redirecting all 404 error to this custom error page.

app.use(function (req, res, next) {
  res.status(404);
  if (req.accepts("html")) {
    res.render("404");
    return;
  }
});



//Setting port Dynamically 

let port = process.env.PORT || 3000;


//Listening on custom port.
app.listen(port, (req, res) => {
  console.log("Server is active on port " + port);
});
