const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    originalname: [
      {
        type: String,
        required: true,
      },
    ],

    size: [
      {
        type: String,
        require: true,
      },
    ],
  },

  {
    timestamps: true,
  }
);

const File = mongoose.model("file", fileSchema);
module.exports = File;

// For Single File

// originalname: {
//   type: String,
//   required: true,
// },
// size: {
//   type: String,
//   required: true,
// },
