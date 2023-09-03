const router = require("express").Router();
const User = require("../Models/registerSchema");
const { validationResult, matchedData } = require("express-validator");
const validationRegister = require("../validation/register");
const validationLogin = require("../validation/login");
var bcrypt = require('bcryptjs');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authenticateJWT = require("../validation/authorization");
dotenv.config();

router.post("/", validationRegister.form, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({message:errors.errors[0].msg, data:null, status:500, error:true})
    } else {
        const {firstName, lastName, userName, password} = req.body;
        const query = User.where({userName:userName})
        const checkUserexist = await query.findOne();
        if(!checkUserexist){
          const encryptedUserPassword = await bcrypt.hash(password, 10);
          console.log("encryptedPassword ", encryptedUserPassword)
          const creatUser = new User({
            firstName:firstName,
            lastName:lastName,
            userName:userName,
            password:encryptedUserPassword
          });
          await creatUser.save();
          res.send({message:"User created successfully", data:null, status:200, error:false})
        }else{
          res.send({message:"This username already exist", data:null, status:500, error:true})
        }
    }
  } catch (err) {
    console.log("err ", err)
    return res.sendStatus(500);
  }
});

router.post("/login", validationLogin.form, async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({message:errors.errors[0].msg, data:null, status:500, error:true})
    } else {
        const {userName, password} = req.body;
        let user = await User.findOne({ userName });
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = jwt.sign(
            { user_id: user._id, userName },
            process.env.TOKEN_KEY,
            {
              expiresIn: "12h",
            }
          );
          user.token = token;
          delete user.password;
          const newUser = {
            token:token,
            firstName:user.firstName,
            lastName:user.lastName
          }
          res.send({message:"Login Successfull", data:newUser, status:200, error:false})
          // user
          //return res.status(200).json(user);
        }else{
          res.send({message:"Invalid Credentials", data:null, status:500, error:true})
        }
    }
  }catch(err){
    console.log("err ", err)
    return res.sendStatus(500);
  }
  
});

router.get("/authorization", authenticateJWT, async(req, res) => {
  try{
    if(req.user){
      res.send({
        message: "",
        data: null,
        status: 200,
        error: false,
      });
    }else{
      res.send({
        message: "Unauthorized",
        data: null,
        status: 403,
        error: true,
      });
    }
  }catch(err){
    return res.sendStatus(500);
  }
})

module.exports = router;
