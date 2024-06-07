const express = require("express");
const router = express.Router();

const registerController = require("../controllers").register;

router.post("/save", registerController.addUser);

module.exports = router;
