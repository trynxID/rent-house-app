const mongoose = require("mongoose");
const { getFormatTime } = require("../utils/time");

const TransactionSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  transaction_date: {
    type: String,
    default: getFormatTime,
  },
  profit: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

TransactionSchema.pre("save", async function (next) {
  try {
    const booking = await mongoose.model("Booking").findById(this.booking);
    if (booking && booking.total_price) {
      this.profit = booking.total_price * 0.05;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
