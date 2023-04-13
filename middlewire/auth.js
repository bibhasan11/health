const isLogin =async (req,res,next)=>{
    try {
        console.log("Success Islogin")
      if(req.session.user_id){
        
      }else{
        res.redirect("/log")
      }
      next();
    } catch (error) {
      console.log(error)
    }
  }
  
  const isLogout = async (req,res,next)=>{
    try {
        console.log("Success Islogout")
      if(req.session.user_id ){
        res.redirect("/admin")
      }
      else{
        // res.redirect("/login")
      }
      next();
    } catch (error) {
      console.log(error)
    }
  }

  module.exports = {
    isLogin,
    isLogout
  }