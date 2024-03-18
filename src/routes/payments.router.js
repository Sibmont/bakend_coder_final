import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import Router from "./router.js";

// New restructuring imports
import { paymentIntent } from "../controllers/payments.controller.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    this.post(
      "/payment-intents",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      paymentIntent
    );
  }
}
