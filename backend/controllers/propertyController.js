const Property = require("../models/properties");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const getAllProperties = async (req, res) => {
  const properties = await Property.find();
  res.status(200).json(properties);
};

const addProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, price, occupant, stocks, rating } = req.body;

    const location = {
      street: req.body["location.street"],
      village: req.body["location.village"],
      district: req.body["location.district"],
      city: req.body["location.city"],
      province: req.body["location.province"],
      country: req.body["location.country"],
    };

    const details = {
      size: req.body["details.size"],
      bathrooms: req.body["details.bathrooms"],
      furnished: req.body["details.furnished"] === "true",
      wifi: req.body["details.wifi"] === "true",
      ac: req.body["details.ac"] === "true",
      kitchen: req.body["details.kitchen"] === "true",
    };

    console.log("Received data:", req.body);

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/public/images/property/${file.filename}`
      );
    } else {
      images = ["/public/images/property/default.jpg"];
    }

    const newProperty = new Property({
      title,
      description,
      price: parseFloat(price),
      location,
      images,
      occupant,
      details,
      stocks: parseInt(stocks, 10),
      rating: parseFloat(rating),
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
    const updateFields = req.body;

    const {
      location,
      details,
      title,
      description,
      price,
      occupant,
      stocks,
      rating,
    } = updateFields;

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ msg: "Properti tidak ditemukan" });
    }

    if (location) {
      existingProperty.location = {
        ...existingProperty.location,
        ...location,
      };
    }

    if (details) {
      existingProperty.details = {
        ...existingProperty.details,
        ...details,
      };
    }

    if (title) existingProperty.title = title;
    if (description) existingProperty.description = description;
    if (price) existingProperty.price = price;
    if (occupant) existingProperty.occupant = occupant;
    if (stocks) existingProperty.stocks = stocks;
    if (rating) existingProperty.rating = rating;

    const updatedProperty = await existingProperty.save();

    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const deletePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ msg: "Properti tidak ditemukan" });
    }

    const isNotDefaultImage = property.images.some(
      (imagePath) => !imagePath.includes("default.jpg")
    );

    if (isNotDefaultImage) {
      property.images.forEach((imagePath) => {
        const filePath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "property",
          path.basename(imagePath)
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      await Property.findByIdAndDelete(id);
      return res.status(200).json({ msg: "Properti berhasil dihapus" });
    } else {
      await Property.findByIdAndDelete(id);
      return res.status(200).json({ msg: "Properti berhasil dihapus" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Kesalahan server");
  }
};

const getPropertyForEdit = async (req, res) => {
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

const getCities = async (req, res) => {
  try {
    const cities = await Property.distinct("location.city");
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProperties,
  addProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  getPropertyForEdit,
  getCities,
};
