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
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email required")
    .not()
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .withMessage("Please enter valid email id"),
  // username validation
  check("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number required")
    .matches(/^\d{10}$/)
    .withMessage("Please valid mobile number")
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
  check("dateOfBirth").notEmpty().withMessage("Date of birth required"),
  check("address").notEmpty().withMessage("Address required")
];
