require("dotenv").config();
require("./config/database");
const path = require("path");

const User = require("./models/user.model");
const authrouter = require("./routes/routes");
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["yasin"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "/build/index.html"));
});
app.use("/", authrouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
