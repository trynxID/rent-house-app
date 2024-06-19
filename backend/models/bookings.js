const mongoose = require("mongoose");
const { getCurrentTime, calculateEndDate } = require("../utils/time");
const Property = require("./properties");

const BookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  total_price: {
    type: Number,
  },
  duration_in_months: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: getCurrentTime,
  },
  updated_at: {
    type: Date,
    default: getCurrentTime,
  },
  status: {
    type: String,
    enum: ["failed", "pending", "success"],
  },
});

BookingSchema.pre("save", async function (next) {
  if (this.start_date && this.duration_in_months) {
    this.end_date = calculateEndDate(this.start_date, this.duration_in_months);
  }

  const property = await Property.findById(this.property);
  if (property && property.price) {
    this.total_price = property.price * this.duration_in_months;
  }

  next();
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
