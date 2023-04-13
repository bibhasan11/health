const isLogin = async (req, res, next) => {
  try {
    console.log("Success blog Islogin");
    if (req.session.user_id) {
    } else {
      res.redirect("/login/blog");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const isLogout = async (req, res, next) => {
  try {
    console.log("Success blog Islogout");
    if (req.session.user_id) {
      res.redirect("/create/post");
    } else {
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
