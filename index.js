// cloud connnection string //mongodb+srv://nigadeswaroop7777:saitavdekarDbgetbacchu@cluster0.kfgpmpd.mongodb.net/ 
const express = require("express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require("dotenv");
var cors = require('cors');
const xss = require('xss-clean');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());

// import routes
const auth = require("./src/Routes/Authuser");
const customerInfo = require("./src/Routes/CustomerInfo");
const report = require("./src/Routes/Reports");
const dashboard = require("./src/Routes/Dashboard");
dotenv.config();    

// conntect to db
const dbConnect = async() => {
    try{
        const db = await mongoose.connect(process.env.DB_CONNECT_LOCAL, { useNewUrlParser: true });
        console.log("connected to DB")
    }catch(err){
        console.log("db err", err)
    }
}

dbConnect();
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.log("connection error", err.message)
})

app.use(helmet({
    crossOriginEmbedderPolicy: false,
    // ...
  }));

// Rate Limiting
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout 
    message: 'Too many requests' // message to send
});
//app.use(express.bodyParser({limit: '50mb'}));
// middleware

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
//app.use(express.json({ limit: '10kb' }));
app.use("/customerPics", express.static('public/customerimages/pics'));

app.use("/register", auth);
app.use("", auth);
app.use("/insertTransationDetails", customerInfo)
app.use("", customerInfo);
app.use("", report);
app.use("", dashboard);
app.use(mongoSanitize());


// Data Sanitization against XSS attacks
app.use(xss());

app.listen(8081, () => console.log("Server up and running"));