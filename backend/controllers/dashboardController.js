const User = require("../models/users");
const Property = require("../models/properties");
const Booking = require("../models/bookings");
const Transaction = require("../models/transactions");

const getTotalCounts = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const propertiesCount = await Property.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const transactionsCount = await Transaction.countDocuments();

    const totalProfit = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" },
        },
      },
    ]);

    res.status(200).json({
      usersCount: usersCount,
      propertiesCount: propertiesCount,
      bookingsCount: bookingsCount,
      transactionsCount: transactionsCount,
      totalProfit: totalProfit[0]?.totalProfit || 0,
    });
  } catch (error) {
    console.error("Error while getting total counts:", error);
    res.status(500).json({ error: "Failed to get total counts" });
  }
};

module.exports = {
  getTotalCounts,
};
