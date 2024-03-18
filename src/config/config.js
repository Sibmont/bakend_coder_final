import dotenv from "dotenv";

dotenv.config();

export default {
  mongoUrl: process.env.MONGO_URL,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  persistance: process.env.PERSISTANCE,
  environment: process.env.ENVIRONMENT,
  userNodemailer: process.env.USER_NODEMAILER,
  passwordNodemailer: process.env.PASSWORD_NODEMAILER,
};
