const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require("./db/connect");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: "*",
  })
);
// app.use(cors({ origin: "*" }));
app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  // this is the basic express session({...}) initialization
  .use(passport.initialize())
  // init passport on every route call
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    next();
  })
  .use("/", require("./routes"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accesToken, refreshToken, profile, done) {
      //use
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/",
  (req, res) => {
    res.send(
      req.session.user !== undefined
        ? `Logged in as ${req.session.user.displayName}`
        : "Logged Out"
    );
  },
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "api-docs",
    session: false,
  })
);

process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
