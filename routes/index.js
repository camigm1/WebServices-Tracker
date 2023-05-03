const express = require("express");
const router = express.Router();

router.use("/books", require("./books"));
router.use("/", require("./swagger"));

module.exports = router;
