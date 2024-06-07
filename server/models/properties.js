const mongoose = require("mongoose");
const { getCurrentTime } = require("../utils/time");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      street: {
        type: String,
        required: true,
      },
      village: {
        type: String,
      },
      district: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    occupant: [
      {
        type: String,
        enum: ["Pria", "Wanita", "Campur"],
      },
    ],
    details: {
      size: {
        type: String,
        required: true,
      },
      bathrooms: {
        type: String,
        enum: ["Dalam", "Luar"],
        required: true,
      },
      facilities: [
        {
          furnished: {
            type: Boolean,
            default: false,
          },
          wifi: {
            type: Boolean,
            default: false,
          },
          ac: {
            type: Boolean,
            default: false,
          },
          kitchen: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    stocks: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
      required: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
        created_at: {
          type: Date,
          default: getCurrentTime,
        },
      },
    ],
    created_at: {
      type: Date,
      default: getCurrentTime,
    },
    updated_at: {
      type: Date,
      default: getCurrentTime,
    },
  },
  { collection: "properties" }
);

propertySchema.pre("save", function (next) {
  this.updated_at = getCurrentTime;
  next();
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
