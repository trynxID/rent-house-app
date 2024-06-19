const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers").dashboard;
const { verifyToken } = require("../utils/token");

router.get("/total", verifyToken, dashboardController.getTotalCounts);

module.exports = router;