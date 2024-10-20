require("dotenv").config();
require("../config/database");

const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../utils/sendEmail");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Todo = require("../models/todo.model");

const express = require("express");
const app = express();

const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo } = req.body;

    //Validate the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    //Validate the user is exists or not
    const user = await User.findOne({ email });

    if (user) return res.status(400).json("User already exists");

    //Hashing the password and new user creating
    bcrypt.genSalt(8, (error, salt) => {
      bcrypt.hash(password, 8, async (error, hash) => {
        const newUser = new User({
          // firstName,
          // lastName,
          // phoneNo,
          email,
          password: hash,
        });
        await newUser.save();

        //Token Generator

        const token = await jwt.sign(
          {
            // firstName,
            // lastName,
            // phoneNo,
            email,
            password,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "2d",
          }
        );

        //Send Email
        const link =
          "http://" + req.hostname + ":3000/verifyemail?token=" + token;

        const sendMail = await sendVerificationEmail(newUser.email, link);
        if (sendMail) {
          return res.status(201).json({
            success: true,
            message:
              "User is registered  successfully! Error in sending verification email ",
          });
        } else {
          return res.status(201).json({
            success: true,
            message: "User is registered  successfully! ",
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = await jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );
    if (!token) {
      return res.status(401).json({
        message: "User is not logged in successfully ",
      });
    } else {
      return res.status(200).json({
        message: "User is logged in successfully ",
        token: "Bearer " + token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please enter the valid email ",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User is not found",
    });
  }

  //Token Generator

  const token = await jwt.sign(
    {
      email,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "2d",
    }
  );

  //Send Email
  const link = "http://" + req.hostname + ":3000/resetpassword?token=" + token;

  const sendMail = await sendForgotPasswordEmail(user.email, link);
  if (sendMail) {
    return res.status(201).json({
      success: true,
      message: " Error in sending email ",
    });
  } else {
    return res.status(201).json({
      success: true,
      message: "Email Sent!",
    });
  }
};
const verifyTokenController = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Invalid Token!",
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    // err
    return res.status(404).json({
      err,
    });
  }

  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User is not found",
    });
  }
  res.status(200).json({
    success: true,
    data: decodedToken.email,
  });
};

const resetPasswordController = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  //Validate the input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  //Validate the user is exists or not
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ success: false, message: "User not Found!" });

  //Hashing the password and new user creating
  bcrypt.genSalt(8, (error, salt) => {
    bcrypt.hash(newPassword, 8, async (error, hash) => {
      const updatedPassword = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            password: hash,
          },
        }
      );
      if (updatedPassword) {
        return res.status(200).json({
          success: true,
          message: "Password Updated Successfully!",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong!",
        });
      }
    });
  });
};

//Verify Email Controller

const varifyEmailController = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Invalid Token!",
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    // err
    return res.status(404).json({
      err,
    });
  }

  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User is not found",
    });
  }
  user.verified = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: "You are verified Successfully!",
  });
};

const todoCreateController = (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the field!" });
  }
  try {
    const newTodo = new Todo({
      title,
      description,
    });
    newTodo.save();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    success: true,
    message: "Todo is created successfully...",
  });
};

const todoUpdateController = async (req, res) => {
  const { title, description, _id } = req.body;
  const todo = await Todo.findOne({ _id });

  if (!todo)
    return res
      .status(400)
      .json({ success: false, message: "Todo is not Found!" });

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id },
    {
      $set: {
        title,
        description,
      },
    }
  );
  if (updatedTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo Updated Successfully!",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const todoDeleteController = async (req, res) => {
  const { _id } = req.body;
  const todo = await Todo.findOne({ _id });

  if (!todo)
    return res
      .status(400)
      .json({ success: false, message: "Todo is not Found!" });

  const deleteTodo = await Todo.findOneAndDelete({ _id });
  if (deleteTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo deleted Successfully!",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
todoGetController = async (req, res) => {
  try {
    const allTodos = await Todo.find();
    res.send(allTodos);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  verifyTokenController,
  resetPasswordController,
  varifyEmailController,
  todoCreateController,
  todoUpdateController,
  todoDeleteController,
  todoGetController,
};
