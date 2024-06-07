const login = require("./loginController");
const register = require("./registerController");
const user = require("./userController.js");
const property = require("./propertyController");
const booking = require("./bookingController");
const transaction = require("./transactionController");

module.exports = {
  login,
  register,
  user,
  property,
  transaction,
  booking,
};
