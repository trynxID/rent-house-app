const User = require("../models/users");
require("dotenv").config();
const { validationResult, check } = require("express-validator");

const addUser = [
  check("fullname", "Nama lengkap diperlukan").not().isEmpty(),
  check("email", "Email tidak valid dan wajib diisi")
    .isEmail()
    .normalizeEmail(),
  check("password", "Kata sandi diperlukan").not().isEmpty(),
  check(
    "no_phone",
    "Nomor telepon harus dalam format Indonesia dan tidak boleh kosong"
  )
    .isMobilePhone("id-ID")
    .withMessage("Nomor telepon harus dalam format Indonesia"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, fullname, password, no_phone, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Pengguna sudah ada" });
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
