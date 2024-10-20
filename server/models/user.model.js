const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    //   firstName: {
    //     type: String,
    //     maxLength: 15,
    //     required: true,
    //   },
    //   lastName: {
    //     type: String,
    //     maxLength: 15,
    //     required: true,
    //   },
    //   phoneNo: {
    //     type: String,
    //     maxLength: 15,
    //     required: true,
    //   },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
