const { check, sanitizeBody } = require("express-validator");
//const characterCheck = require("../constants/validationConstants")
//console.log("validation ", characterCheck);
exports.form = [
  // first Name validation
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name required")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Only Characters with white space are allowed"),
  // last Name validation
  check("lastName")
    .notEmpty()
    .withMessage("Last Name required")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Only Characters with white space are allowed"),
  // username validation
  check("userName")
    .trim()
    .notEmpty()
    .withMessage("User Name required")
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
  // username validation
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage("Please enter valid password")
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
  // confirm password validation
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password Confirmation does not match password");
    }
    return true;
  }),
];
