const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    firstName:"string",
    lastName:"string",
    userName:"string",
    password:"string"
});

const User = mongoose.model('Users', registerSchema, "Users");

module.exports = User;