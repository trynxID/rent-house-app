const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { getCurrentTime } = require("../utils/time");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    no_phone: {
      type: String,
      required: true,
    },
    img_url: {
      type: String,
      default: null,
    },
    last_login_time: {
      type: Date,
      default: null,
    },
    role: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
      required: true,
    },
    created_at: {
      type: Date,
      default: getCurrentTime,
    },
    updated_at: {
      type: Date,
      default: getCurrentTime,
    },
  },
  { collection: "users" }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
