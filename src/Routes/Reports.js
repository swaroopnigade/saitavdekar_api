const router = require("express").Router();
const authenticateJWT = require("../validation/authorization");
const dotenv = require("dotenv");
dotenv.config();
const Transactiondetails = require("../Models/transactionDetails");
const TransactiondetailsHistory = require("../Models/transactionDetailsHistory");

router.get("/report", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      let getTransactionDetails = null;
      if (req.query.page) {
        getTransactionDetails = await Transactiondetails.find()
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec();
      } else {
        getTransactionDetails = await Transactiondetails.find();
      }
      
      const count = await Transactiondetails.count();
      const newData = {
        transactionData: getTransactionDetails,
        count: count,
      };

      res.send({ message: "", data: newData, status: 200, error: false });
    } else {
      res.send({
        message: "You are not valid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log("report ", err);
  }
});

router.get("/transactionHistory", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      const getReqEditData = await TransactiondetailsHistory.find({
        transactionId: req.query.transactionId,
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort([["transactionDate", -1]])
        .exec();
      const count = await TransactiondetailsHistory.find({
        transactionId: req.query.transactionId,
      });
      const newData = {
        transactionData: getReqEditData,
        count: count.length,
      };
      res.send({
        message: "",
        data: newData,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("transactionHistory err ", err);
    return res.sendStatus(500);
  }
});

router.get("/dailyReport", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      const filter = req.query.filter;
      const now = new Date();
      const startOfToday =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

      let getReqEditData = null;

      if (req.query.page) {
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: { $gte: startOfToday },
        }).limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec() : await Transactiondetails.find({
            transactionDate: { $gte: startOfToday },
            transactionStatus: filter
          })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort([["transactionDate", -1]])
            .exec();
      } else {
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: { $gte: startOfToday },
        }) : await Transactiondetails.find({
          transactionDate: { $gte: startOfToday },
          transactionStatus: filter
        })
      }

      const count = filter === "Report " ? await Transactiondetails.find({
        transactionDate: { $gte: startOfToday },
      }) : await Transactiondetails.find({
        transactionDate: { $gte: startOfToday },
        transactionStatus: filter
      }); //getReqEditData.length || 0;
      const newData = {
        transactionData: getReqEditData,
        count: count.length,
      };
      res.send({
        message: "",
        data: newData,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("dailyReport err ", err);
    return res.sendStatus(500);
  }
});

router.get("/weeklyReport", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      const filter = req.query.filter;
      const now = new Date();

      const date_today = new Date();
      const first_day_of_the_week = new Date(
        date_today.setDate(date_today.getDate() - date_today.getDay())
      );
      const last_day_of_the_week = new Date(
        date_today.setDate(date_today.getDate() - date_today.getDay() + 6)
      );

      let getReqEditData = null;
      if (req.query.page) {
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: {
            $gte: first_day_of_the_week,
            $lte: last_day_of_the_week,
          },
        }).limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec() : await Transactiondetails.find({
            transactionDate: {
              $gte: first_day_of_the_week,
              $lte: last_day_of_the_week,
            },
            transactionStatus: filter
          })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort([["transactionDate", -1]])
            .exec();
      } else {
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: {
            $gte: first_day_of_the_week,
            $lte: last_day_of_the_week,
          },
        }) : await Transactiondetails.find({
          transactionDate: {
            $gte: first_day_of_the_week,
            $lte: last_day_of_the_week,
          },
          transactionStatus: filter
        })
      }


      const count = filter === "Report" ? await Transactiondetails.find({
        transactionDate: {
          $gte: first_day_of_the_week,
          $lte: last_day_of_the_week,
        },
      }) : await Transactiondetails.find({
        transactionDate: {
          $gte: first_day_of_the_week,
          $lte: last_day_of_the_week,
        },
        transactionStatus: filter
      }); //getReqEditData.length || 0;
      const newData = {
        transactionData: getReqEditData,
        count: count.length,
      };
      res.send({
        message: "",
        data: newData,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("weeklyReport err ", err);
    return res.sendStatus(500);
  }
});

router.get("/monthlyReport", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      const filter = req.query.filter;
      const now = new Date();

      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      let getReqEditData = null;

      if (req.query.page) {
        console.log('1111 ', req.query.page)
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: {
            $gte: firstDay,
            $lte: lastDay,
          },
        }).limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec() : await Transactiondetails.find({
            transactionDate: {
              $gte: firstDay,
              $lte: lastDay,
            },
            transactionStatus: filter
          })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort([["transactionDate", -1]])
            .exec();
      } else {
        console.log('22222 ', req.query.page)
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: {
            $gte: firstDay,
            $lte: lastDay,
          },
        }) : await Transactiondetails.find({
          transactionDate: {
            $gte: firstDay,
            $lte: lastDay,
          },
          transactionStatus: filter
        })
      }

      const count = filter === "Report" ? await Transactiondetails.find({
        transactionDate: {
          $gte: firstDay,
          $lte: lastDay,
        },
      }) : await Transactiondetails.find({
        transactionDate: {
          $gte: firstDay,
          $lte: lastDay,
        },
        transactionStatus: filter
      }); //getReqEditData.length || 0;
      const newData = {
        transactionData: getReqEditData,
        count: count.length,
      };
      res.send({
        message: "",
        data: newData,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("monthlyReport err ", err);
    return res.sendStatus(500);
  }
});

router.get("/customReport", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      const filter = req.query.filter;

      let getReqEditData = null;

      if (req.query.page) {
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: {
            $gte: req.query.fromDate,
            $lte: req.query.toDate,
          },
        }).limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec() : await Transactiondetails.find({
            transactionDate: {
              $gte: req.query.fromDate,
              $lt: req.query.toDate,
            },
            transactionStatus: filter
          })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort([["transactionDate", -1]])
            .exec();
      } else {
        getReqEditData = filter === "Report" ? await Transactiondetails.find({
          transactionDate: {
            $gte: req.query.fromDate,
            $lte: req.query.toDate,
          },
        }) : await Transactiondetails.find({
          transactionDate: {
            $gte: req.query.fromDate,
            $lte: req.query.toDate,
          },
          transactionStatus: filter
        })
      }


      const count = filter === "Report" ? await Transactiondetails.find({
        transactionDate: {
          $gte: req.query.fromDate,
          $lte: req.query.toDate,
        },
      }) : await Transactiondetails.find({
        transactionDate: {
          $gte: req.query.fromDate,
          $lte: req.query.toDate,
        },
        transactionStatus: filter
      }); //getReqEditData.length || 0;
      const newData = {
        transactionData: getReqEditData,
        count: count.length,
      };
      res.send({
        message: "",
        data: newData,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("customReport err ", err);
    return res.sendStatus(500);
  }
});

router.get("/nameList", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;
      const getParam = req.query["firstName"].split(" ");
      const regex1 = RegExp(getParam[0], "i");
      const regex2 = RegExp(getParam[1], "i");

      // const searchData = await Transactiondetails.find(
      //   { firstName: regex1, lastName:regex2 },
      //   { firstName: 1, lastName: 1 }
      // ).sort({ firstName: -1 });

      const searchData = await Transactiondetails.find({
        $text: {
          $search: RegExp(req.query["firstName"], "i")
        }
      });

      console.log(searchData);

      const data = [];
      for (let i = 0; i < searchData.length; i++) {
        const temp = {
          _id: searchData[i]._id,
          name: searchData[i].firstName + " " + searchData[i].lastName,
        };
        data.push(temp);
      }
      res.send({
        message: "",
        data: data,
        status: 200,
        error: false,
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log("customReport err ", err);
    return res.sendStatus(500);
  }
});

router.get("/reportByName", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const getReqEditData = await Transactiondetails.findOne({
        _id: req.query.transactionId,
      });
      res.send({
        message: "",
        data: {
          transactionData: [getReqEditData],
          count: getReqEditData.count,
        },
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

router.get("/pendingTransactions", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;

      let getTransactionDetails = null;

      if (req.query.page) {
        getTransactionDetails = await Transactiondetails.find({
          transactionStatus: "Pending"
        })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec();
      } else {
        getTransactionDetails = await Transactiondetails.find({
          transactionStatus: "Pending"
        })
      }


      const count = await Transactiondetails.count({
        transactionStatus: "Pending"
      });
      const newData = {
        transactionData: getTransactionDetails,
        count: count,
      };

      res.send({ message: "", data: newData, status: 200, error: false });
    } else {
      res.send({
        message: "You are not valid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log("pending ", err);
  }
});

router.get("/completedTransactions", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const page = parseInt(req.query.page) || 1; //for next page pass 1 here
      const limit = parseInt(req.query.limit) || 10;

      let getTransactionDetails = null;

      if (req.query.page) {
        getTransactionDetails = await Transactiondetails.find({
          transactionStatus: "Completed"
        })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort([["transactionDate", -1]])
          .exec();
      } else {
        getTransactionDetails = await Transactiondetails.find({
          transactionStatus: "Completed"
        })
      }

      const count = await Transactiondetails.count({
        transactionStatus: "Completed"
      });
      const newData = {
        transactionData: getTransactionDetails,
        count: count,
      };

      res.send({ message: "", data: newData, status: 200, error: false });
    } else {
      res.send({
        message: "You are not valid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log("pending ", err);
  }
});

module.exports = router;
