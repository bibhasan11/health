const router = require("express").Router();
const {Comment} = require("../models/comment");
const { route } = require("./adminAuth");

router.post("/create/comment",async(req,res)=>{
    try{
        const comment = new Comment(req.body);
        const savaAppoitment = await comment.save();
        res.status(200).json(savaAppoitment);
    }catch(error){
        res.status(500).json(error);
    }
})

router.get("/comment/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const comment =await Comment.findById(req.params.id)
        res.status(200).json(comment);
    }catch(error){
        res.status(500).json(error);
    }
})

router.get("/all/comments",async(req,res)=>{
    try{
        const comments = await Comment.find();
        res.status(200).json(comments);
    }catch(error){
        res.status(500).json(error)
    }
})

 module.exports = router;