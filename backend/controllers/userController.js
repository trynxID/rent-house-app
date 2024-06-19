const User = require("../models/users");
const { validationResult } = require("express-validator");
const { userValidationUpdate } = require("../utils/validation");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res) => {
  const users = await User.find();
  res.status(200);
  res.json(users);
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    user.img_url = `/public/images/members/${req.file.filename}`;
    await user.save();

    const payload = {
      id: user._id,
      user: user.fullname,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const updateUser = [
  ...userValidationUpdate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, no_phone } = req.body;

    try {
      let user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
      }

      user.fullname = fullname;
      user.email = email;
      user.no_phone = no_phone;

      await user.save();

      const payload = {
        id: user._id,
        user: user.fullname,
        email: user.email,
        no_phone: user.no_phone,
        role: user.role,
        img_url: user.img_url,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Kesalahan server");
    }
  },
];

const logoutAndUpdateLastLogin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { last_login_time: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    res.json({ msg: "Logout berhasil" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

module.exports = {
  getAllUser,
  uploadProfileImage,
  updateUser,
  logoutAndUpdateLastLogin,
};
