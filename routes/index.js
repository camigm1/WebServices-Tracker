const express = require("express");
const router = express.Router();

router.use("/books", require("./books"));
router.use("/users", require("./users"));
router.use("/", require("./swagger"));

module.exports = router;
