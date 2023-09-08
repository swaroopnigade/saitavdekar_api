const mongoose = require("mongoose");

const transactionDetailsHistorySchema = new mongoose.Schema({
    transactionId:{
        type:String,
        required:true
    },
    invoiceId:{
        type:String,
        required:true,
        index: { unique: true },
    },
    firstName:{
        type:String,
        min:4,
        max:255,
        required:true
    },
    lastName:{
        type:String,
        min:4,
        max:255,
        required:true
    },
    email:{
        type:String,
        min:4,
        max:255
    },
    mobileNo:{
        type:Number,
        required:true
    },
    dateOfBirth:{
        type : Date, 
        required:true
    },
    address:{
        type : String, 
        required:true
    },
    metalType:{
        type:String,
        required:true,
    },
    product:{
        type:String,
        required:true,
    },
    productWeight:{
        type:Number,
        required:true,
    },
    weightUnit:{
        type:String,
        required:true,
    },
    amount:{
        type : Number, 
        required:true
    },
    amountPaid:{
        type : Number, 
        required:true
    },
    amountPending:{
        type : Number, 
        required:true
    },
    totalAmountPaid:{
        type : Number, 
        required:true 
    },
    idCardType:{
        type : Number, 
        required:true
    },
    idCardNumber:{
        type : String, 
        required:true
    },
    transactionDate:{
        type : Date, 
        default: Date.now,
        required:true
    },
    customerPicName:{
        type : String, 
        required:true
    },
    transactionStatus:{
        type : String, 
        required:true
    },
    customerPic:{
        type : String, 
        required:true
    },
    addedBy:{
        type : String, 
        required:true
    },
    referenceBy:{
        type : String,
    },
    referenceByNo:{
        type : String,
    },
    comment:{
        type : String,
    },
    updatedBy:{
        type : String, 
        required:true
    }
});

const TransactiondetailsHistory = mongoose.model('TransactiondetailsHistory', transactionDetailsHistorySchema, "TransactiondetailsHistory");

module.exports = TransactiondetailsHistory;