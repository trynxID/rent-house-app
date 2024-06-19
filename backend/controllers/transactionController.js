const Booking = require("../models/bookings");
const Property = require("../models/properties");
const Transaction = require("../models/transactions");

const createTransaction = async (req, res) => {
  try {    
    const bookingId = req.params.id;

    const newTransaction = new Transaction({
      booking: bookingId,      
      status: "success",
    });

    await newTransaction.save();
    
    const relatedBooking = await Booking.findById(bookingId);
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

    res.status(201).json({ msg: "Pembayaran berhasil", transaction: newTransaction });
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

const getAllTransactionsWithDetails = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: "booking",
        populate: [
          {
            path: "user",
            model: "User",
            select: "fullname",
          },
          {
            path: "property",
            model: "Property",
            select: "title", 
          },
        ],
      })
      .exec();

    res.status(200).json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createTransaction,
  getTransactionByUser,
  getAllTransactionsWithDetails
};
