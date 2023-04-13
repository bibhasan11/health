const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types;
const PostSchema = new mongoose.Schema(

  {
    title:{
      type:String,
      require:true
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: false,
    },
    username: {
      // type: String,
      type:mongoose.Schema.Types.String,
      ref:'User',
      require: true,
    },
    categories: {
      type: Array,
      require: false,
    },
    content:{
      type:String,
      require:true,
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model("Post", PostSchema)
