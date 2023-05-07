const validator = require("validate-helper.js");

const saveUser = async (req, res, next) => {
  const validationRule = {
    firstName: "required|string",
    lastName: "required|string",
    username: "required|string",
    birthday: "string",
    email: "required|string|email",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};
module.exports = {
  saveUser,
};
