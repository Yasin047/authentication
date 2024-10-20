const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authenticate(req, res, next) {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token!",
      });
    }
    token = token.split(" ")[1];

    decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid token!",
    });
  }
}

module.exports = authenticate;
