const router = require("express").Router();
const twilio = require('twilio');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid,authToken);

// app.post('/send-sms/:id',(req,res)=>{
    router.post('/send-sms',(req,res)=>{
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
module.exports = router;