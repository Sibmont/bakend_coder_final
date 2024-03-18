import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __mainDirname = path.join(__dirname, "..");

// Hash password
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//   1234 -> s23k8dgh23

// Validate password
const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

const generateToken = (user) => {
  const token = jwt.sign({ user }, config.PRIVATE_KEY_JWT, {
    expiresIn: "24h",
  });
  return token;
};

export { __dirname, __mainDirname, createHash, generateToken, isValidPassword };
