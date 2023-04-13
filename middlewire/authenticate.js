function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login/blog"); // or send error message
  }
}

module.exports = {
    isAuthenticated,
};
