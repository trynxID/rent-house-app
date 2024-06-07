const Property = require("../models/properties");
const User = require("../models/users");
const { validationResult } = require("express-validator");

const getAllProperties = async (req, res) => {
  const properties = await Property.find();
  res.status(200);
  res.json(properties);
};

const addProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const owner = req.user.id;
  const {
    title,
    description,
    price,
    location,
    images,
    category,
    details,
    capacity,
    availability,
    status,
  } = req.body;

  try {
    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !category ||
      !details ||
      !capacity ||
      !availability ||
      !status
    ) {
      return res.status(400).json({ msg: "Semua data harus diisi" });
    }

    const user = await User.findById(owner);
    if (!user || user.role !== 2) {
      return res
        .status(403)
        .json({ msg: "Anda tidak memiliki izin untuk menambahkan properti" });
    }

    // Buat properti baru
    const newProperty = new Property({
      owner,
      title,
      description,
      price,
      location,
      images,
      category,
      details,
      capacity,
      availability,
      status,
    });

    await newProperty.save();
    res.status(201).json({ msg: "Properti berhasil ditambahkan" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ msg: "Properti tidak ditemukan" });
    }
    res.status(200).json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const updatePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      location,
      category,
      details,
      capacity,
      availability,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !category ||
      !details ||
      !capacity ||
      !availability ||
      !status
    ) {
      return res.status(400).json({ msg: "Semua data harus diisi" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ msg: "Properti tidak ditemukan" });
    }

    res
      .status(200)
      .json({ msg: "Properti berhasil diperbarui", updatedProperty });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const deletePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ msg: "Properti tidak ditemukan" });
    }
    res.status(200).json({ msg: "Properti berhasil dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

module.exports = {
  getAllProperties,
  addProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
};
