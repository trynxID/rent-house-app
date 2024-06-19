const multer = require("multer");
const { getFormatTime } = require("./time");
const path = require("path");

const storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/members");
  },
  filename: function (req, file, cb) {
    cb(null, getFormatTime() + "-" + file.originalname);
  },
});

const storageProperty = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/property");
  },
  filename: function (req, file, cb) {
    cb(null, getFormatTime() + "-" + file.originalname);
  },
});

const uploadProfile = multer({ storage: storageProfile });
const uploadProperty = multer({ storage: storageProperty });

module.exports = {
  uploadProfile,
  uploadProperty,
};
