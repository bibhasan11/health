const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    token:{
      type: String,
      default: "",
    },
    isAdmin:{
      type:Number,
      default:0
    },
    type:{
      type:String,
      require:true
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model("LoginUser", UserSchema)
