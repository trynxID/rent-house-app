const login = require("./loginController");
const register = require("./registerController");
const user = require("./userController.js");
const property = require("./propertyController");
const booking = require("./bookingController");
const transaction = require("./transactionController");
const dashboard = require("./dashboardController");

module.exports = {
  login,
  register,
  user,
  property,
  transaction,
  booking,
  transaction,
  dashboard
};
