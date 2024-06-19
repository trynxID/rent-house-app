const express = require("express");
const router = express.Router();
const { uploadProfile } = require("../utils/multer");
const user = require("../controllers").user;
const { verifyToken } = require("../utils/token");

router.get("/", user.getAllUser);

router.get("/detail/:id", user.getDetailUser);

router.post(
  "/upload/:id",
  uploadProfile.single("profileImage"),
  user.uploadProfileImage
);

router.put("/update/:id", verifyToken, user.updateUser);

router.delete("/delete/:id", verifyToken, user.deleteUser);

router.put("/logout/:id", user.logoutAndUpdateLastLogin);

router.post("/add", verifyToken, uploadProfile.single("images"), user.addUser);

module.exports = router;
