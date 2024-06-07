const express = require("express");
const router = express.Router();
const upload = require('../utils/multer');
const user = require("../controllers").user;
const { verifyToken } = require('../utils/token');

router.get("/", user.getAllUser);

router.post('/upload/:id', upload.single('profileImage'), user.uploadProfileImage);

router.put('/update/:id', verifyToken, user.updateUser);

router.put('/logout/:id', user.logoutAndUpdateLastLogin);

module.exports = router;
