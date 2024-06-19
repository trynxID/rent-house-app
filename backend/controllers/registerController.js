const User = require("../models/users");
require("dotenv").config();
const { validationResult } = require("express-validator");
const { userValidationRules } = require("../utils/validation");

const addUser = [
  ...userValidationRules(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, fullname, password, no_phone, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email sudah terdaftar" }] });
      }

      user = new User({
        fullname,
        email,
        password,
        no_phone,
        role,
      });

      await user.save();
      res.status(200).json({ msg: "Registrasi berhasil" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Kesalahan server");
    }
  },
];

module.exports = { addUser };
