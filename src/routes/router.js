import { Router as expressRouter } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import {
  EErrors,
  accessRolesEnum,
  passportStrategiesEnum,
} from "../config/enums.js";
import CustomError from "../middlewares/errors/CustomError.js";

export default class Router {
  constructor() {
    this.router = expressRouter();
    this.init(); // Our parent class should have the method's definition and the child classes should have the implementation (each separate router)
  }

  getRouter() {
    return this.router;
  }

  init() {}

  // Get, Post, Put, Delete, Patch
  // ...callbacks to be able to receive multiple parameters or middlewares
  get(path, strategy, policies, ...callbacks) {
    this.router.get(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, strategy, policies, ...callbacks) {
    this.router.post(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, strategy, policies, ...callbacks) {
    this.router.put(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, strategy, policies, ...callbacks) {
    this.router.delete(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  patch(path, strategy, policies, ...callbacks) {
    this.router.patch(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (data) => {
      res.status(200).json({ data });
    };

    res.sendSuccessNewResource = (data) => {
      res.status(201).json({ data });
    };

    res.sendServerError = (error) => {
      res.status(500).json({ error });
      // throw CustomError.createError({
      //   name: error.name,
      //   cause: "Internal Server Error",
      //   message: error.message,
      //   code: EErrors.INTERNAL_SERVER_ERROR,
      // });
    };

    res.sendServerErrorNotFound = (error) => {
      console.log("Custom error about to be thrown:", error);
      throw CustomError.createError({
        name: "Resource Not Found",
        cause: "Resource does not exist/does not match values",
        message: "ERROR",
        code: EErrors.RESOURCE_NOT_FOUND,
      });
    };

    res.sendClientError = (error) => {
      // res.status(400).json({ error });
      throw CustomError.createError({
        name: error.name,
        cause: "Client Error",
        message: error.message,
        code: EErrors.INVALID_TYPE_ERROR,
      });
    };

    res.sendClientErrorAuth = (error) => {
      // res.status(401).json({ error });
      throw CustomError.createError({
        name: error.name,
        cause: "Missing authorization",
        message: error.message,
        code: EErrors.AUTHORIZATION_ERROR,
      });
    };

    res.sendClientErrorData = (error) => {
      throw CustomError.createError({
        name: error.name,
        cause: "Invalid Data/Missing required fields",
        message: error.message,
        code: EErrors.INVALID_TYPE_ERROR,
      });
    };

    next();
  };

  applyCustomPassportCall = (strategy) => (req, res, next) => {
    if (
      strategy === passportStrategiesEnum.JWT ||
      strategy === passportStrategiesEnum.LOCALREGISTER ||
      strategy === passportStrategiesEnum.LOCALLOGIN ||
      strategy === passportStrategiesEnum.GITHUB ||
      strategy === passportStrategiesEnum.GITHUB_LOGIN
    ) {
      // Custom passport call
      passport.authenticate(strategy, function (err, user, info) {
        if (err) return next(err);

        if (!user)
          return res
            .status(401)
            .send({ error: info.messages ? info.messages : info.toString() });

        req.user = user;
        next();
      })(req, res, next);
    } else {
      next();
    }
  };

  handlePolicies = (policies) => (req, res, next) => {
    const user = req.user;

    if (policies[0] === accessRolesEnum.PUBLIC) return next();

    if (!policies.includes(user.role.toUpperCase())) {
      return res.status(403).json({ error: "No permissions" });
    }

    next();
  };

  applyCallbacks(callbacks) {
    // Map callbacks 1 by 1 to obtain their parameters (req, res)
    return callbacks.map((callback) => async (...params) => {
      try {
        // Apply executes the callback function to our class instance (router)
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).send({ status: "error", message: error.message });
      }
    }); //(req, res)
  }
}
