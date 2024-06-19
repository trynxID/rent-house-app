const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/token");
const transactionController = require("../controllers").transaction;

router.post("/accept/:id", verifyToken, transactionController.createTransaction);

router.get("/user", verifyToken, transactionController.getTransactionByUser);

router.get("/", verifyToken, transactionController.getAllTransactionsWithDetails);

module.exports = router;
