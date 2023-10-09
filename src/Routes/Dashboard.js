const router = require("express").Router();
const authenticateJWT = require("../validation/authorization");
const dotenv = require("dotenv");
dotenv.config();
const Transactiondetails = require("../Models/transactionDetails");

router.get("/pieChart", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const peningTransactions = await Transactiondetails.find({
        transactionStatus: "Pending",
      }).count();
      const completedTransactions = await Transactiondetails.find({
        transactionStatus: "Completed",
      }).count();
      const data = {
        labels: ["Pending Transactions", "Completed Transactions"],
        datasets: [
          {
            label: '',
            data: [peningTransactions, completedTransactions],
            backgroundColor: [
              "#dc3545",
              "#198754"
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1,
          },
        ],
      }
      res.send({ message: "", data: data, status: 200, error: false });
    } else {
      res.send({
        message: "You are not va    lid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log("pieChart ", err);
  }
});

router.get("/barChart", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      const date = new Date();
      const bardata = [["Year", "Total", "Completed", "Pending"]];

      const data = {
        labels,
        datasets: [
          {
            label: "Total",
            data: [],
            backgroundColor: "#0d6efd"
          },
          {
            label: "Completed",
            data: [],
            backgroundColor: "#198754"
          },
          {
            label: "Pending",
            data: [],
            backgroundColor: "#dc3545"
          }
        ]
      };

      for (let i = 0; i < labels.length; i++) {
        const firstDay = new Date(date.getFullYear(), i, 1);
        const lastDay = new Date(date.getFullYear(), i + 1, 0);
        const match_stage = {
          $match: {
            transactionDate: {
              $gt: firstDay,
              $lt: lastDay,
            },
          },
        };

        const group_stage = {
          $group: {
            _id: "$transactionStatus",
            count: { $sum: 1 },
          },
        };

        const pipeline = [match_stage, group_stage];
        const posts = await Transactiondetails.aggregate(pipeline);

        if (posts.length === 0) {
          data.datasets[0].data.push(0);
          data.datasets[1].data.push(0);
          data.datasets[2].data.push(0);
        } else if (posts.length === 1) {
          const makeData = [];
          const group1 = posts[0];
          data.datasets[0].data.push(group1?.count || 0);
          if (group1?._id === "Completed") {
            data.datasets[1].data.push(group1.count || 0);
            data.datasets[2].data.push(0);
          }
          if (group1?._id === "Pending") {
            data.datasets[1].data.push(0);
            data.datasets[2].data.push(group1.count || 0);
          }
          bardata.push(makeData);
        } else {
          const makeData = [];
          const group1 = posts[0];
          const group2 = posts[1];
          data.datasets[0].data.push(group1?.count + group2?.count);
          if (group1?._id === "Completed") {
            data.datasets[1].data.push(group1.count || 0);
          }
          if (group2?._id === "Completed") {
            data.datasets[1].data.push(group2.count || 0);
          }
          if (group1?._id === "Pending") {
            data.datasets[2].data.push(group1.count || 0);
          }
          if (group2?._id === "Pending") {
            data.datasets[2].data.push(group2.count || 0);
          }
          bardata.push(makeData);
        }
      }
      res.send({ message: "", data: data, status: 200, error: false });
    } else {
      res.send({
        message: "You are not va    lid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log("pieChart ", err);
  }
});

router.get("/cardCounts", authenticateJWT, async (req, res) => {
  try {
    if (req.user) {
      const match_stage = {
        $match: {},
      };

      const group_stage = {
        $group: {
          _id: "$transactionStatus",
          count: { $sum: 1 },
        },
      };

      const pipeline = [match_stage, group_stage];
      const transactiondetails = await Transactiondetails.aggregate(pipeline);
      const tempData = {
        total: 0,
        completed: 0,
        pending: 0,
      };
      if (transactiondetails.length > 0) {
        let setCount = 0
        for (let i = 0; i < transactiondetails.length; i++) {
          console.log("transactiondetails ", transactiondetails[i]);
          if (transactiondetails[i]._id === "Completed") {
            tempData.completed = transactiondetails[i].count || 0;
            //setCount = setCount + transactiondetails[i].count
          }
          if (transactiondetails[i]._id === "Pending") {
            tempData.pending = transactiondetails[i].count || 0;

          }
          setCount = setCount + transactiondetails[i].count
        }
        tempData.total = setCount;
      }

      console.log("tempData ", tempData);
      res.send({
        message: "",
        data: tempData,
        status: 200,
        error: false,
      });
    } else {
      res.send({
        message: "You are not va    lid user",
        data: null,
        status: 500,
        error: true,
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log("pieChart ", err);
  }
});

module.exports = router;
