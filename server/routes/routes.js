const File = require("../models/file.model");
const express = require("express");
const { check } = require("express-validator");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const jwt = require("jsonwebtoken");

const multer = require("multer");

const {
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
} = require("../controllers/controllers");

const registerValidation = [
  // check("firstName")
  //   .isLength({ min: 4 })
  //   .withMessage("Please enter a first name which is minimum 4 characters"),
  // check("lastName")
  //   .isLength({ min: 4 })
  //   .withMessage("Please enter a last name which is minimum 4 characters"),
  // check("phoneNo")
  //   .isMobilePhone()
  //   .isLength({ min: 11 })
  //   .withMessage(
  //     "Please enter a valid phone number which is minimum 11 character and not greater than 15 character"
  //   ),
  check("email").isEmail().withMessage("Please enter a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Please enter password which is minimum 6 characters"),
];
router.post("/register", registerValidation, registerController);

//Login Route

const loginValidation = [
  check("email").isEmail().withMessage("Please enter a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Please enter a valid password "),
];

router.post("/login", loginController);

//Forgot Password
const forgotPasswordValidation = [
  check("email").isEmail().withMessage("Please enter a valid email"),
];

router.post(
  "/forgotpassword",
  forgotPasswordValidation,
  forgotPasswordController
);

//Verify Token

router.get("/verifytoken", authenticate, verifyTokenController);

//Reset Password

const resetPasswordValidation = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Please enter a valid password "),
  check("confirmNewPassword")
    .isLength({ min: 6 })
    .withMessage("Please enter a valid password "),
];

router.post(
  "/resetpassword",
  resetPasswordValidation,
  authenticate,
  resetPasswordController
);

//
router.get("/verifyemail", authenticate, varifyEmailController);

//Protected Route
router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({ success: true });
});
//Todo Route

const checkRole = (roles) => (req, res, next) => {
  console.log(req.user);
  !roles.includes(req.user.role)
    ? res.status(401).json("Access denied")
    : next();
};

router.post(
  "/todo-create",
  authenticate,
  checkRole(["admin"]),
  todoCreateController
);

router.post("/todo-update", authenticate, todoUpdateController);

router.post("/todo-delete", authenticate, todoDeleteController);

router.get("/todo-get", authenticate, todoGetController);

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });
// For Multiple File

router.post("/send-file", upload.array("file"), async (req, res) => {
  // console.log(req.files);
  try {
    const newFile = new File({
      originalname: req.files.map((file) => {
        return file.originalname;
      }),
      size: req.files.map((file) => {
        return file.size;
      }),
    });
    await newFile.save();
    res.status(200).send("File is uploaded successfully!");
  } catch (error) {
    console.log(error);
  }
});

//For single file

// router.post("/send-file", upload.single("file"), async (req, res) => {
//   console.log(req.file);
//   try {
//     const newFile = new File({
//       originalname: req.file.originalname,
//       size: req.file.size,
//     });
//     await newFile.save();
//     res.status(200).send("File is uploaded successfully!");
//   } catch (error) {
//     console.log(error);
//   }
// });

router.get("/get-file", (req, res) => {
  console.log(res);
});

//Download File

router.get("/file-download", (req, res) => {});

// Resource Not Found

router.use((req, res, next) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// Server error

router.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;
