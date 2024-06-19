const { check } = require('express-validator');

const userValidationRules = () => {
  return [
    check('fullname', 'Nama lengkap diperlukan').not().isEmpty(),
    check('email', 'Email tidak valid dan wajib diisi').isEmail().normalizeEmail(),
    check('password', 'Kata sandi diperlukan').not().isEmpty(),
    check('no_phone', 'Nomor telepon harus dalam format Indonesia dan tidak boleh kosong')
      .isMobilePhone('id-ID')
      .withMessage('Nomor telepon harus dalam format Indonesia'),
  ];
};

const userValidationUpdate = () => {
    return [
        check('fullname', 'Nama lengkap tidak boleh kosong').notEmpty(),
        check('email', 'Email harus valid').isEmail(),
        check('no_phone', 'Nomor telepon harus dalam format Indonesia dan tidak boleh kosong')
            .isMobilePhone('id-ID')
            .withMessage('Nomor telepon harus dalam format Indonesia'),
    ];
};

module.exports = {
  userValidationRules,
  userValidationUpdate
};
