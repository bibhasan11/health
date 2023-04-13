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
      unique:true,
      require: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    token:{
      type: String,
      default: "",
    },
    isLogin:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
)


// Hiding private datas
UserSchema.methods.privateData = async function(){
  const user = this;
  const userObj = user.toObject();
  console.log('------>',userObj);
  return userObj;
}


module.exports = mongoose.model("User", UserSchema)
