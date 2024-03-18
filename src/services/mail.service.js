import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.userNodemailer, // env variable
    pass: config.passwordNodemailer, // env variable
  },
});

export const sendEmail = async (email) => {
  await transporter.sendMail({
    from: "ECommerce SB Coder",
    to: email.to,
    subject: email.subject,
    html: email.html,
  });
};
