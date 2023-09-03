const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
destination: function (req, files, callback) {
    cb(null, "public/customerdocuments");
    },
  filename: (req, files, callback) => {
    console.log("inv sajjkdhsdhsj ", files)
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(files.mimetype) === -1) {
      var message = `${files.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }

    var filename = `${Date.now()}-bezkoder-${files.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;