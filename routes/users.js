const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");
const validation = require("../validate-middleware.js");
const { isAuthenticated } = require("../middleware/authenticate");

router.get("/", usersController.getAll);

router.get("/:id", usersController.getSingle);

router.post(
  "/",
  validation.saveUser,
  isAuthenticated,
  usersController.createUser
);

router.put(
  "/:username",
  validation.saveUser,
  isAuthenticated,
  usersController.updateUser
);

router.delete("/:username", isAuthenticated, usersController.deleteUser);

module.exports = router;
