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
const blogAuth = require("./middlewire/blogAuth");
const Post = require("./models/post");
const authenticate = require("./middlewire/authenticate.js");
const compression = require("compression");
const serverless = require('serverless-http')
const router = express.Router();


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

router.post('/send-sms',(req,res)=>{
  const {to,body} = req.body;
  client.messages.create({
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


router.use("/api/appoitment",appoitmentRoute),
router.use("/api/blog",blogRoute);
// app.use("/api/user/auth",limitter.registerLimitter,userRoute);
router.use("/api/user/auth",userRoute);
router.use("/api/admin/auth",adminRoute);
router.use("/api/appoitment/meeting",meetingRoute),
router.use("/api",commentRoute);


router.get("/autocomplete",(req,res,next)=>{
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
router.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
// Blog sidebar
router.get("/blog-sidebar", function (req, res) {
  res.sendFile(__dirname + "/public/blog-sidebar.html");
});
// Single-Blog
router.get("/blog-single", function (req, res) {
  res.sendFile(__dirname + "/public/blog-single.html");
});
// Department
router.get("/department",function (req, res) {
  res.sendFile(__dirname + "/public/department.html");
});
// About
router.get("/about", function (req, res) {
  res.sendFile(__dirname + "/public/about.html");
});
// Contact
router.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/public/contact.html");
});
//Create Blog Form
router.get("/create/post",authenticate.isAuthenticated,(req,res)=>{
  res.sendFile(__dirname + "/public/create.html")
});
//Register Page
router.get("/posts/account",(req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
// Login Page
router.get("/posts/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
// User Login
router.get("/log",adminAuth.isLogout,(req,res)=>{
  res.sendFile(__dirname + '/public/userLogin.html')
})
// User Register
router.get("/reg",(req,res)=>{
  res.sendFile(__dirname + '/public/userRegister.html')
})
// Admin page
router.get("/admin",adminAuth.isLogin,(req,res)=>{
  res.sendFile(__dirname + '/public/admin.html')
})
// Patient Appoitment
router.get("/appoinment", (req, res) => {
  res.sendFile(__dirname + "/public/appoinment.html");
});
// UserPanel 
router.get("/userpanel",(req,res)=>{
  res.sendFile(__dirname + '/public/userPanel.html')
})
router.get("/register/blog",(req,res)=>{
  res.sendFile(__dirname + '/public/register.html')
})
router.get("/login/blog",blogAuth.isLogout,(req,res)=>{
  res.sendFile(__dirname + '/public/login.html')
})
router.get("/406/error",(req,res)=>{
  res.sendFile(__dirname + '/public/406.html')
})
router.get("/500/error",(req,res)=>{
  res.sendFile(__dirname + '/public/500.html')
})
router.get("/402/error",(req,res)=>{
  res.sendFile(__dirname + '/public/402.html')
})
router.get("/forgot-password",(req,res)=>{
  res.sendFile(__dirname + '/public/forgot.html')
})
router.get("/resetPassword",(req,res)=>{
  res.sendFile(__dirname + '/public/reset-password.html');
})
// Setting the Port...
// app.listen(5500, function () {
//   console.log("Server listening to the port 5500");
// });
app.use('/.netlify/api', router);
module.exports.handler = serverless(app);