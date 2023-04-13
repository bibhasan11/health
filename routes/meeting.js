const router = require("express").Router();
const {google} = require('googleapis');
const { OAuth2 } = google.auth;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Meeting = require("google-meet-api").meet;
const passport = require("passport")


//meet auth
clientID =
  "885857859975-iv7tldic8iaafife0d2hcqcsmo6gjstu.apps.googleusercontent.com";
clientSecret = "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";

const oauth2Client = new OAuth2(
  "885857859975-iv7tldic8iaafife0d2hcqcsmo6gjstu.apps.googleusercontent.com",
  "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"
);


oauth2Client.setCredentials({
    refresh_token:
      "1//0ghnHSqsGfnKICgYIARAAGBASNwF-L9IrRQq0crQxghW5InV_lwwtsR6r5RTmvhYazqxN8ZBO6wiO5YHKfVoCvzcPqniHOGYApfo",
  });


const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });


passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: "http://localhost:5500/auth/callback",
        scope: ["profile", "https://www.googleapis.com/auth/calendar"],
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log("refreshToken : ", refreshToken);
        return cb();
      }
    )
  );


router.get(
    "/auth",
    passport.authenticate("google", {
      scope: ["profile", "https://www.googleapis.com/auth/calendar"],
      accessType: "offline",
      prompt: "consent",
    })
  );
  
  router.get(
    "/auth/callback",
    passport.authenticate("google", { failureRedirect: "/" })
  );


router.get("/link/:id", (req, res) => {
    try {
      const id = req.params.id;
      var arr = id.split("@");
      var t = arr[0];
      var d = arr[1];
      Meeting({
        clientId:
          "885857859975-iv7tldic8iaafife0d2hcqcsmo6gjstu.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//0ghnHSqsGfnKICgYIARAAGBASNwF-L9IrRQq0crQxghW5InV_lwwtsR6r5RTmvhYazqxN8ZBO6wiO5YHKfVoCvzcPqniHOGYApfo",
        date:d,
        time:t,
        summary: "summary",
        location: "location",
        description: "description",
      }).then(function (result) {
        res.status(200).json({result})
        console.log("Link:",result);
        return result;
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  module.exports = router;