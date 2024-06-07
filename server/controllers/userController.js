const { validationResult, check } = require("express-validator");
const User = require("../models/users");
const getAllUser = async (req, res) => {
  const users = await User.find();
  res.status(200);
  res.json(users);
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    }

    user.img_url = `/images/members/${req.file.filename}`;
    await user.save();

    res.json({ img_url: user.img_url });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const updateUser = [
  check('fullname', 'Nama lengkap tidak boleh kosong').notEmpty(),
  check('email', 'Email harus valid').isEmail(),
  check('no_phone', 'Nomor telepon harus dalam format Indonesia dan tidak boleh kosong')
    .isMobilePhone('id-ID')
    .withMessage('Nomor telepon harus dalam format Indonesia'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, no_phone } = req.body;

    try {
      let user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
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
        img_url: user.img_url
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Kesalahan server');
    }
  }
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
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    }

    res.json({ msg: 'Logout berhasil' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Kesalahan server');
  }
};


module.exports = {
  getAllUser,
  uploadProfileImage,
  updateUser,
  logoutAndUpdateLastLogin
};