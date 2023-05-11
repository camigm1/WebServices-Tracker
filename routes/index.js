const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use("/books", require("./books"));
router.use("/users", require("./users"));
router.use("/", require("./swagger"));

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
