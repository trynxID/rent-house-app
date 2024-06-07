const multer = require("multer");
const { getFormatTime } = require("./time");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/members/images");
  },
  filename: function (req, file, cb) {
    cb(null, getFormatTime + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
