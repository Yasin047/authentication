const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log("DB is connected");
  })
  .catch((error) => {
    console.log(error.message);
  });
