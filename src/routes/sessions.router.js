// import { Router } from "express";
import passport from "passport";
import UsersDto from "../DTOs/users.dto.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import Users from "../dao/managers/dbManagers/users.manager.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import Router from "./router.js";

// const router = Router();

export default class SessionsRouter extends Router {
  constructor() {
    super();
    this.usersManager = new Users();
  }

  init() {
    this.post(
      "/register",
      passportStrategiesEnum.LOCALREGISTER,
      [accessRolesEnum.PUBLIC],
      this.register
    );

    this.post(
      "/login",
      passportStrategiesEnum.LOCALLOGIN,
      [accessRolesEnum.PUBLIC],
      this.login
    );

    this.get(
      "/github",
      passportStrategiesEnum.GITHUB,
      [accessRolesEnum.PUBLIC],
      this.githubRegister
    );

    this.get(
      "/github-callback",
      passportStrategiesEnum.GITHUB_LOGIN,
      [accessRolesEnum.PUBLIC],
      this.githubLogin
    );

    this.get(
      "/logout",
      passportStrategiesEnum.NA,
      [accessRolesEnum.PUBLIC],
      this.logout
    );

    this.get(
      "/current",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      this.current
    );
  }

  async register(req, res) {
    res.sendSuccessNewResource("User created successfully");
  }

  async login(req, res) {
    if (!req.user) {
      return res.sendClientErrorAuth("Invalid credentials");
    }

    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      last_login: req.user.last_login,
    };

    const accessToken = generateToken(req.user);
    console.log(accessToken);

    res.sendSuccess(accessToken);
  }

  async githubRegister(req, res) {
    res.sendSuccess("Register successful");
  }

  async githubLogin(req, res) {
    req.session.user = req.user;
    res.redirect("/products");
  }

  async current(req, res) {
    const user = new UsersDto(req.user);
    res.sendSuccess(user);
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) res.sendClientError(err.message);

      res.redirect("/login");
    });
  }
}
