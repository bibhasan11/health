const router = require("express").Router();
const { Appointment } = require("../models/appointment.model");

// Create Appoitment
router.post("/appoitment", async (req, res) => {
    const newAppoitment = new Appointment(req.body);
    try {
      const saveAppoitment =await newAppoitment.save();
      // res.status(200).json(saveAppoitment);
      res.status(200).redirect("/");
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // All appotments
  router.get("/all", async (req, res) => {
    try {
      const appoitments = await Appointment.find();
      res.status(200).json(appoitments);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  // Delete Appoitment from admin panel
  router.delete("/delete/:id",async(req,res)=>{
    const deletedPatient = await Appointment.findById(req.params.id);
    try{
      await deletedPatient.delete();
      res.status(200).json(deletedPatient);
    }catch(error){
      res.status(500).json(error)
    }
  })
  
  // Get single appoitment by id 
  router.get("/app/:id",async(req,res)=>{
    try{
     const appoinmentSingle = await Appointment.findById(req.params.id);
      res.status(200).json(appoinmentSingle);
    }catch(error){
      res.status(500).json(error)
    }
  })

// Update Appoitment
router.put("/update/:id",async(req,res)=>{
  const appointment = await Appointment.findById(req.params.id);
  try{
    const updataAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        $set:req.body,
      },
      {
        new:true
      }
      );
    res.status(200).json(updataAppointment);
  }catch(error){
    res.status(500).json(error);
  }
})

module.exports = router;