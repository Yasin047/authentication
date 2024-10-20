const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yasinmahmud0047@gmail.com", // generated ethereal user
    pass: "xiswpidntubseglv", // generated ethereal password
  },
});
module.exports = {
  sendVerificationEmail: async (senderAddress, link) => {
    let error = false;
    try {
      let info = await transporter.sendMail({
        from: "yasinmahmud0047@gmail.com", // sender address
        to: senderAddress, // list of receivers
        subject: "Verify Email", // Subject line
        html: `Please Verify Your Email by Clicking <a href="${link}">here</a> <br/>
              This link will be valid for only 2 days`, // html body
      });
    } catch (error) {
      error = true;
    }

    return error;
  },
  sendForgotPasswordEmail: async (senderAddress, link) => {
    let error = false;
    try {
      let info = await transporter.sendMail({
        from: "yasinmahmud0047@gmail.com", // sender address
        to: senderAddress, // list of receivers
        subject: "Reset Password", // Subject line
        html: `Please Reset Your Password  by Clicking <a href="${link}">here</a> <br/>
              This link will be valid for only 2 days`, // html body
      });
    } catch (error) {
      error = true;
    }

    return error;
  },
};
