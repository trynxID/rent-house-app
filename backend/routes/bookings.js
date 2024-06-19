const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { verifyToken } = require("../utils/token");
const bookingController = require("../controllers").booking;

router.get("/", verifyToken, bookingController.getAllBookings);

router.get("/user", verifyToken, bookingController.getBookingsByUser);

router.get("/:id", verifyToken, bookingController.getBookingById);

router.put('/cancel/:id', verifyToken, bookingController.cancelBooking);

router.delete("/delete/:id", verifyToken, bookingController.deleteBookingsById);

router.post(
  "/add",
  [
    check("propertyId", "Property diperlukan").not().isEmpty(),
    check("start_date", "Tanggal mulai diperlukan").not().isEmpty(),
    check("duration_in_months", "Durasi dalam bulan diperlukan").isInt({
      min: 1,
    }),
    check("userId", "ID pengguna diperlukan").not().isEmpty(),
  ],
  verifyToken,
  bookingController.addBooking
);

module.exports = router;
