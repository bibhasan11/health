const router = require("express").Router();
const { route } = require("./adminAuth");
const Post = require("../models/post");
const authenticate = require("../middlewire/authenticate.js");

// create post
router.post("/post/create",authenticate.isAuthenticated, async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savepost = await newPost.save();
      res.status(200).redirect("/");
    } catch (error) {
      res.status(500).json(error);
    }
  });

//Single Post
router.get("/post/blog-single/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post)
      // res.status(200).redirect("/blog-single");
    } catch (error) {
      res.status(400).json(error);
    }
  });

// update post
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatePost);
        } catch (error) {
          res.status(500).json(error);
        }
      } else {
        res.status(401).json("You can update only your post!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });
  

  // Delete post
  router.delete("/delete/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          await post.delete();
          res.status(200).json("Post has been deleted successfully");
        } catch (error) {
          res.status(500).json(error);
        }
      } else {
        res.status(401).json("You can not delete the post! ");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  // Get all post
  router.get("/posts/all", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
      const { page = 1, limit = 4 } = req.query;
      let posts;
      if (username) {
        posts = await Post.find({ username: username })
          .limit(limit * 1)
          .skip((page - 1) * limit);
      } else if (catName) {
        posts = await Post.find({
          categories: {
            $in: [catName],
          },
        })
          .limit(limit * 1)
          .skip((page - 1) * limit);
      } else {
        posts = await Post.find()
          .limit(limit * 1)
          .skip((page - 1) * limit);
      }
      res.status(200).json(posts);
    } catch (error) {
      res.status(404).json(error);
    }
  });
  

  // Search posts
  router.get("/post",async (req,res)=>{
    try{
      const { page = 1, limit = 4} = req.query;
      var search = '';
      if(req.query.search){
        search = req.query.search;
        req.session.searchQuery = search;
      }
      const posts = await Post.find({
        $or:[
          {
            username:{$regex:'.*' + search+'.*',$options:'i'},
          },
          {
            title:{$regex:'.*' + search+'.*',$options:'i'},
          },
          {
            description:{$regex:'.*' + search+'.*',$options:'i'},
          }
        ]
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      res.status(200).json(posts)
    }catch(error){
      res.status(500).json(error)
    }
  })



  router.get("/getSearch",async (req,res)=>{
    // console.log(req.session.user);
    if(req.session.searchQuery){
          console.log(req.session.searchQuery);
    }
  })
  module.exports = router;