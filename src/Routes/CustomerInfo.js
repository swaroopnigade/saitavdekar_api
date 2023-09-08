const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const Transactiondetails = require("../Models/transactionDetails");
const TransactiondetailsHistory = require("../Models/transactionDetailsHistory");
const authenticateJWT = require("../validation/authorization");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/customerimages");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.post("/", authenticateJWT, upload.array("file", 4), async (req, res) => {
  try {
    if (req.user) {
      console.log("req ==== ", req.user);
      if (req.files.length !== 1) {
        res.send({
          message: "Something went wrong",
          data: null,
          status: 500,
          error: true,
        });
      } else {
        const { filename: file } = req.files[0];
        await sharp(req.files[0].path)
          //.jpeg({ quality: 10 })
          .toFile(path.resolve(req.files[0].destination, "pics", file));
        fs.unlinkSync(req.files[0].path);
        const getReqData = JSON.parse(req.body.formData);
        const saveData = {
          firstName: getReqData.firstName,
          lastName: getReqData.lastName,
          email: getReqData.email,
          mobileNo: getReqData.mobileNo,
          dateOfBirth: getReqData.dateOfBirth,
          address: getReqData.address,
          metalType: getReqData.metalType,
          product:getReqData.product,
          productWeight:getReqData.productWeight,
          weightUnit:getReqData.weightUnit,
          amount: getReqData.amount,
          amountPaid: getReqData.amountPaid,
          totalAmountPaid:getReqData.amountPaid,
          amountPending: getReqData.amountPending,
          idCardType: getReqData.idCardType,
          idCardName: getReqData.idCardName,
          idCardNumber: getReqData.idCardNumber,
          transactionDate: getReqData.transactionDate,
          customerPicName: req.files[0].originalname,
          transactionStatus: getReqData.transactionStatus,
          //customerPic: `${req.files[0].destination}/pics/${req.files[0].filename}`,
          customerPic: `${process.env.PATH_NAME}/customerPics/${req.files[0].filename}`,
          transactionStatus:
            getReqData.amountPending === 0 ? "Completed" : "Pending",
          addedBy: req.user.userName,
          referenceBy:getReqData.referenceBy,
          referenceByNo:getReqData.referenceByNo,
          comment:getReqData.comment,
          updatedBy:req.user.userName
        };
        try {
          const dataToSave = new Transactiondetails({
            ...saveData,
          });
          const getSaveDetails = await dataToSave.save();
          if (getSaveDetails) {
            const historyData = new TransactiondetailsHistory({
              ...saveData,
              invoiceId:getSaveDetails.invoiceId,
              transactionId: getSaveDetails._id.toString(),
            });
            await historyData.save();
            res.send({
              message: "Customer Details saved successfully",
              data: null,
              status: 200,
              error: false,
            });
          } else {
            res.send({
              message: "Something Went Wrong",
              data: null,
              status: 500,
              error: true,
            });
          }
        } catch (err) {
          console.log("in catch error ==== 1111111", err);
          return res.sendStatus(500);
        }
      }
    } else {
      res.send({
        message: "You are not valid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    console.log("in catch error ==== ", err);
    return res.sendStatus(500);
  }
});

router.get("/getcustomerinfo", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const getReqEditData = await Transactiondetails.findOne({
        _id: req.query.transactionId,
      });
      res.send({
        message: "",
        data: getReqEditData,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("getcustomerinfo err ", err);
    return res.sendStatus(500);
  }
});

router.put(
  "/updateTransationDetails",
  authenticateJWT,
  upload.array("file", 0),
  async (req, res) => {
    try {
      //const getReqData = JSON.parse(req.body.formData);

      if (req.user) {
        const getReqData = JSON.parse(req.body.formData);
        const getReqEditData = await Transactiondetails.findOne({
          _id: getReqData._id,
        });
       
        if(getReqEditData.transactionStatus === "Pending"){
          if (getReqData._id !== getReqEditData._id.toString()) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.firstName !== getReqEditData.firstName) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.lastName !== getReqEditData.lastName) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.email !== getReqEditData.email) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.mobileNo !== getReqEditData.mobileNo) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.address !== getReqEditData.address) {
            res.sendStatus(500);
            return false;
          }else if (getReqData.product !== getReqEditData.product) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.amount !== getReqEditData.amount) {
            res.sendStatus(500);
            return false;
          }else if(parseInt(getReqData.amountPaid) + parseInt(getReqEditData.amountPaid) > parseInt(getReqEditData.amount)){
            res.send({
              message: `Paid amount should not greater than amount - ${getReqEditData.amount}`,
              data: null,
              status: 500,
              error: true,
            });
            return false;
          } else if (getReqData.idCardType !== getReqEditData.idCardType) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.idCardNumber !== getReqEditData.idCardNumber) {
            res.sendStatus(500);
            return false;
          } else if (getReqData.addedBy !== getReqEditData.addedBy) {
            res.sendStatus(500);
            return false;
          } else {
            try {
              const doc = await Transactiondetails.findOneAndUpdate(
                { _id: getReqData._id },
                {
                  amountPaid: getReqData.amountPaid,
                  amountPending: getReqData.amountPending,
                  amountGivenDate: getReqData.amountGivenDate,
                  amountPaid:getReqData.amountPaid,
                  transactionDate:new Date(),
                  totalAmountPaid:parseInt(getReqData.amountPaid) + parseInt(getReqEditData.totalAmountPaid),
                  amountPending:parseInt(getReqEditData.amount) - (parseInt(getReqData.amountPaid) + parseInt(getReqEditData.totalAmountPaid)),
                  transactionStatus:
                  parseInt(getReqEditData.amount) - (parseInt(getReqData.amountPaid) + parseInt(getReqEditData.totalAmountPaid)) === 0 ? "Completed" : "Pending",
                },
                { new: true }
              );
              res.send({
                message: "Transaction updated successfully.",
                data: null,
                status: 200,
                error: false,
              });
              if (doc) {
                delete getReqData._id;
                delete getReqData.transactionDate;
                getReqData.dateOfBirth = new Date(getReqData.dateOfBirth.split("-").reverse().join("-"))
                getReqData.amountPaid = doc.amountPaid;
                getReqData.totalAmountPaid = doc.totalAmountPaid;
                getReqData.amountPending = doc.amountPending;
                getReqData.transactionStatus = doc.transactionStatus;
                getReqData.updatedBy = req.user.userName;
                const historyData = new TransactiondetailsHistory({
                  ...getReqData,
                  transactionId: doc._id.toString(),
                });
                await historyData.save();
              }
            } catch (err) {
              console.log("update and save err ", err);
              res.sendStatus(403);
            }
          }
        }else{
          res.send({
            message: "Completed transaction can not be edited",
            data: null,
            status: 500,
            error: true,
          }, 500);
        }
        
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      console.log("updateTransaction err ", err);
      return res.sendStatus(500);
    }
  }
);

module.exports = router;
