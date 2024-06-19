const Booking = require("../models/bookings");
const Property = require("../models/properties");
const Transaction = require("../models/transactions");

const createTransaction = async (req, res) => {
  try {
    const { booking, payment_method, kode_bayar } = req.body;

    const newTransaction = new Transaction({
      booking,
      payment_method,
      kode_bayar,
      status: "success",
    });

    await newTransaction.save();
    
    const relatedBooking = await Booking.findById(booking);
    if (!relatedBooking) {
      return res.status(404).json({ msg: "Booking tidak ditemukan" });
    }
    relatedBooking.status = "success";
    await relatedBooking.save();
    
    const relatedProperty = await Property.findById(relatedBooking.property);
    if (!relatedProperty) {
      return res.status(404).json({ msg: "Properti tidak ditemukan" });
    }
    relatedProperty.stocks -= 1;
    await relatedProperty.save();

    res
      .status(201)
      .json({ msg: "Pembayaran berhasil", transaction: newTransaction });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const getTransactionByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find().populate({
      path: "booking",
      match: { user: userId },
      populate: {
        path: "property",
        model: "Property",
      },
    });
        
    const userTransactions = transactions.filter(
      (transaction) => transaction.booking !== null
    );

    res.status(200).json(userTransactions);    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

module.exports = {
  createTransaction,
  getTransactionByUser,
};
