const User = require("../models/users");
require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const auth = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Pengguna tidak tersedia" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password salah" });
    }

    const payload = {
      id: user._id,
      user: user.fullname,
      email: user.email,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;

    const expiresIn = 60 * 60 * 1;

    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

module.exports = {
  auth,
};
