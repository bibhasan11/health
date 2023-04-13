var express = require('express');
var router = express();
const User = require("../models/user");
const limitter = require("express-rate-limit");
const bcrypt = require("bcrypt");
const {check,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const bodyParser = require("body-parser");


router.set('view engine', 'ejs');

router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//Saving register route from BruteForce Attack.
const registerLimitter = limitter({
    windowMS: 5 * 60 * 1000,
    max: 2,
    message:null,
    standardHeaders: true,
    legacyHeaders: false,
  });
  

//Safing login route from BruteForce Attack.
const loginLimitter = limitter({
    windowMS: 5 * 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
  });

const generateToken = async (user) => {
    var token = jwt.sign(
      { id: user._id, 
     },
      process.env.SECRET_KEY,
      { expiresIn: '1m'}
    );
    return token;
  }


// Register User
  router.post("/posts/register",[
    check('username','The usernme must be +3 characters long')
      .exists()
      .isLength({min:3}),
    check('email','Email is not valid')
      .notEmpty()
      .withMessage('Email cannot be empty'),
    check('password','')
     .isLength({min:8,max:32})
     .withMessage('Passowrd must be in range of 8 to 32') 
     .matches(/[a-z]/)
     .withMessage('Password must contain at least one lowercase letter')  
     .matches(/[A-Z]/)
     .withMessage('Password must contain at least one uppercase letter')
     .matches(/[0-9]/)
     .withMessage('Password must contain at least one numeric character')
     .matches(/[!@#$%^&*(),.?":{}|<>]/)
     .withMessage('Password must contain at least one special character')
  ]
   ,async (req, res) => {
    const errors = validationResult(req)
    const errorMessages = errors.array().map(error => `<div class="alert alert-warning" role="alert">${error.msg}</div>`).join('');
    if(!errors.isEmpty()){
      // return res.status(422).json({
      //     errors:errors.array()
      // });
      return res.status(400).send(errorMessages);
    }
    else{
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
        });
        const user = await newUser.save();
        res.status(200).json(user);
        // res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({
          errors:error
        })
      }
    }
  });


// Get all user
router.get("/all/users",async (req,res)=>{
  try{
    const posts =await User.find();
    res.status(200).json(posts);
  }catch(error){
    res.status(500).json(error)
  }
})

// Get user by name
router.get("/user",async (req,res)=>{
  const username = req.query.username;
  try{
    const user = await User.findOne({username:username});
    // if(user.isLogin === 1){
    //   console.log("Done")
      res.status(200).json(user)
    }
  //   else{
  //     res.status(400).send({msg:"User is not logged in"})
  //   }
  // }
  catch(error){
    res.status(500).json(error);
  }
})


// Login User
router.post("/posts/log",loginLimitter,[
  check('username','Username is not valid')
  .notEmpty()
  .withMessage('Username cannot be empty'),
  check('password','Password is not valid')
  .notEmpty()
  .withMessage('Password cannot be empty'),
],async (req, res) => {
  const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(422).json({
          errors:errors.array()
      });
    }
  try {
    const user = await User.findOne({ username: req.body.username })
    const validate = await bcrypt.compare(req.body.password, user.password)
    //if no user
    if(!user){
      res.status(400).json("Wrong Credntials!")
    }
    else if(!validate){
      res.status(400).json({
          error:"Wrong Credentials"
      })
    }else{
      const { password, ...other } = user._doc
      req.session.user = user._id;
      // res.status(200).json(user);
      res.status(200).redirect('/blog-sidebar')
    }
  } catch (error) {
    res.status(500).json(error)
  }
})



// Logout
router.get("/logout",async(req,res)=>{
  try{
    req.session.destroy();
    console.log("Done");
    res.redirect("/log");
    console.log("Done1")
  }catch(error){
    res.status(500).json(error);
  }
})

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sourabose66@gmail.com',
    pass: 'weelmmnyhsodglmw'
  }
});


// Forgot password
router.post("/forgot-password",async (req,res)=>{
  try{
    const user = await User.findOne({ username: req.body.username })
    console.log(user)
    if(!user){
      res.status(409).json("User is not registered")
    }
    const secret = process.env.SECRET_KEY + user.password
    const payload = {
      email:user.email,
      _id:user._id,
    }
    console.log(user._id);
    const token = jwt.sign(payload,secret,{expiresIn:'10m'})

    const link = `http://localhost:5500/api/user/auth/reset-password/${user._id}/${token}`

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sourabose66@gmail.com',
        pass: 'weelmmnyhsodglmw'
      }
    });

    let message = {
      from:"sourabose66@gmail.com",
      to:"sourabose2004@gmail.com",
      subject:"Password Reset",
      text: link
    }
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    console.log(link)
    res.send('Password link has been sent...')
  }catch(error){
    console.log(error);
    // res.status(500).json(error)
  }
})


router.get("/reset-password/:id/:token",async (req,res)=>{
  const {id,token} = req.params;
  const user = await User.findOne({_id:id});
  if(!user){
    return res.json({status:"User not exists!!!"});
  }
    try{
      const secret =  process.env.SECRET_KEY + user.password
      const payload = jwt.verify(token,secret)
      res.render('reset-password',{username:user.username})
      // res.redirect('/resetPassword')
      // res.send("Verified");
    }catch(error){
      res.status(500).json(error);
    }
})

// Change the password
router.post("/reset-password/:id/:token",async (req,res,next)=>{
  const {id,token} = req.params;
  console.log(id)
  const user = await User.findOne({_id:id});
  if(!user){
    return res.json({status:"User not exists!!!"});
  }
  const secret =  process.env.SECRET_KEY + user.password
    try{
      const payload = jwt.verify(token,secret)
      const salt =await bcrypt.genSalt(12);
      const hashedPass = await bcrypt.hash(req.body.password,salt);
        await User.updateOne(
          {
            _id:id,
          },
          {
            $set:{
              password:hashedPass,
            },
          },
        );
        res.json({msg:"Password Updated"})
      // }
    }catch(error){
      console.log(error)
      res.status(500).json(error);
    }
})


// Get the user session data from express session 
router.get("/getsession",async (req,res)=>{
  // console.log(req.session.user);
  if(req.session.user){
    const user = await User.findById(req.session.user);
    res.status(200).json(user);
  }else{
    // res.status(500).json({msg:"User is not logged in!!!"})
    res.status(403).redirect("/402/error")
  }
  // res.send("Session" + req.session.user)
})

// Exporting
module.exports = router;