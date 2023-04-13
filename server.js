const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const twilio = require('twilio');
const adminRoute = require("./routes/adminAuth")
const appoitmentRoute = require("./routes/appoitment");
const userRoute = require("./routes/userAuth");
const session = require("express-session");
const blogRoute = require("./routes/blog");
const adminAuth = require("./middlewire/auth");
const meetingRoute = require("./routes/meeting");
const commentRoute = require("./routes/comment")
const limitter = require("./middlewire/registerLimitter")
const path = require("path")
const blogAuth = require("./middlewire/blogAuth");
const Post = require("./models/post");
const authenticate = require("./middlewire/authenticate.js");
const compression = require("compression");
// Step 1:
dotenv.config();
// Step 2:
app.use(express.json());
app.use(compression())
// Step 3:
app.use(express.static("public"));

// Step 4:
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Session 
app.use(session({
  // name:"User",
  secret:process.env.sessionSecret,
  resave:false,
  saveUninitialized:true
}))


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid,authToken);

app.post('/send-sms',(req,res)=>{
  // var id= req.params.id;
  // var arr = id.split("@");
  // var phone = arr[0];
  // var link = arr[1];
  const {to,body} = req.body;
  client.messages.create({
    // body:"The meeting link for scgeduled appointment is:"+link,
    // to:"+91"+phone,
    body:body,
    to:to,
    from:'+14406643564'
  }).then(function(result){
    res.status(200).json({result});
    console.log("Done")
  }).catch((error)=>{
    console.log(error)
    res.status(500).send("Error");
  })
})


app.use("/api/appoitment",appoitmentRoute),
app.use("/api/blog",blogRoute);
// app.use("/api/user/auth",limitter.registerLimitter,userRoute);
app.use("/api/user/auth",userRoute);
app.use("/api/admin/auth",adminRoute);
app.use("/api/appoitment/meeting",meetingRoute),
app.use("/api",commentRoute);


app.get("/autocomplete",(req,res,next)=>{
  var regex = new RegExp(req.query["term"],'i')

  var postFilter = Post.find({username:regex},{'username':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  postFilter.exec((err,data)=>{
   
    var result = [];
    if(!err){
      if(data && data.length && data.length>0){
        data.forEach(posts=>{
          let obj = {
            id:posts._id,
            label:posts.username
          };
          req.session.searchQuery = obj;
          result.push(obj)
        });
      }
      // console.log(result); 
      res.status(200).jsonp(result);
    }
  })
})




// Index
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
// Blog sidebar
app.get("/blog-sidebar", function (req, res) {
  res.sendFile(__dirname + "/public/blog-sidebar.html");
});
// Single-Blog
app.get("/blog-single", function (req, res) {
  res.sendFile(__dirname + "/public/blog-single.html");
});
// Department
app.get("/department",function (req, res) {
  res.sendFile(__dirname + "/public/department.html");
});
// About
app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/public/about.html");
});
// Contact
app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/public/contact.html");
});
//Create Blog Form
app.get("/create/post",authenticate.isAuthenticated,(req,res)=>{
  res.sendFile(__dirname + "/public/create.html")
});
//Register Page
app.get("/posts/account",(req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
// Login Page
app.get("/posts/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
// User Login
app.get("/log",adminAuth.isLogout,(req,res)=>{
  res.sendFile(__dirname + '/public/userLogin.html')
})
// User Register
app.get("/reg",(req,res)=>{
  res.sendFile(__dirname + '/public/userRegister.html')
})
// Admin page
app.get("/admin",adminAuth.isLogin,(req,res)=>{
  res.sendFile(__dirname + '/public/admin.html')
})
// Patient Appoitment
app.get("/appoinment", (req, res) => {
  res.sendFile(__dirname + "/public/appoinment.html");
});
// UserPanel 
app.get("/userpanel",(req,res)=>{
  res.sendFile(__dirname + '/public/userPanel.html')
})
app.get("/register/blog",(req,res)=>{
  res.sendFile(__dirname + '/public/register.html')
})
app.get("/login/blog",blogAuth.isLogout,(req,res)=>{
  res.sendFile(__dirname + '/public/login.html')
})
app.get("/406/error",(req,res)=>{
  res.sendFile(__dirname + '/public/406.html')
})
app.get("/500/error",(req,res)=>{
  res.sendFile(__dirname + '/public/500.html')
})
app.get("/402/error",(req,res)=>{
  res.sendFile(__dirname + '/public/402.html')
})
app.get("/forgot-password",(req,res)=>{
  res.sendFile(__dirname + '/public/forgot.html')
})
app.get("/resetPassword",(req,res)=>{
  res.sendFile(__dirname + '/public/reset-password.html');
})
// Setting the Port...
app.listen(5500, function () {
  console.log("Server listening to the port 5500");
});
