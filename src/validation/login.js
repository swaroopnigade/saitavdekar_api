const { check, sanitizeBody } = require("express-validator");
//const characterCheck = require("../constants/validationConstants")
//console.log("validation ", characterCheck);
exports.form = [
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
    .withMessage("White space not allowed")
];
