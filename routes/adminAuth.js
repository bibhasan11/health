const router = require("express").Router();
const Users = require('../models/userModel')
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");


// User register
router.post("/new/register", async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
        type:req.body.type
      });
      const userType = newUser.type;
      console.log("UserType",userType);
      console.log(typeof(userType))
      if(userType === "Admin")
      {
        console.log(newUser.isAdmin);
        newUser.isAdmin = 1;
        console.log(newUser.isAdmin)
      }
      const user = await newUser.save();
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  });


  // Login Route
router.post("/login",async(req,res)=>{
    try{
      const email = req.body.email;
      const password = req.body.password
      const user = await Users.findOne({email:email});
      if(user){
        console.log("Done");
        const validatePassword = await bcrypt.compare(password,user.password);
        if(validatePassword){
          if(user.isAdmin == 1){
            console.log(user._id)
            req.session.user_id = user._id;
            console.log( req.session.user_id );
            res.status(200).redirect("/admin");
            console.log("Admin login done");
          }else{
            // res.status(201).json({msg:"Patient login done"});
            // req.session.user_id = user._id;
            res.status(200).json({msg:user.type+ +" "+ "login successfull"});
          }
        }else{
          res.status(500).json({msg:"Email and password are incorrect"})
        }
      }
      else{
        res.status(400).json({msg:"Wrong credentials"})
      }
    }catch(error){
      res.status(500).json(error);
    }
  })
  
// Admin logout
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

  module.exports = router;