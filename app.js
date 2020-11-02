const express= require ("express");
const bodyParser= require ("body-parser");
const Razorpay =require("razorpay");

const app = express();

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

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


app.get("/login",(req,res) =>{
    res.render("index");
});

app.get("/donation",(req,res) =>{
    res.render("donation");
});



// Donation Page

let instance = new Razorpay({
    key_id: 'rzp_test_BAMVOtMO48tP5w', // your `KEY_ID`
    key_secret: 'q3ygsL3SscpF8AxcvfUaXV1B' // your `KEY_SECRET`
  })
  
  app.use(bodyParser.json());


  app.post("/api/payment/order",(req,res)=>{
  params=req.body;
  instance.orders.create(params).then((data) => {
         res.send({"sub":data,"status":"success"});
  }).catch((error) => {
         res.send({"sub":error,"status":"failed"});
  })
  });
  
  
  
  
  app.post("/api/payment/verify",(req,res)=>{
  body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('grc_sr', 'q3ygsL3SscpF8AxcvfUaXV1B')
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig"+req.body.razorpay_signature);
                                  console.log("sig"+expectedSignature);
  var response = {"status":"failure"}
  if(expectedSignature === req.body.razorpay_signature)
   response={"status":"success"}
      res.send(response);
  });
  
  
  let port= process.env.PORT || 3000 ;

  app.listen(port, (req,res) => {
      console.log("Server is active on port "+port);
  } );
  