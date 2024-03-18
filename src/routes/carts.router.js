// import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import Router from "./router.js";

// New restructuring imports
import {
  addToCart,
  deleteCartProds,
  deleteProdFromCart,
  getCartProducts,
  getCarts,
  purchaseCart,
  saveCart,
  updateCart,
  updateProdQuant,
} from "../controllers/carts.controller.js";

// const router = Router();

export default class CartsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    // Retrieve carts
    this.get(
      "/",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      getCarts
    );

    // Create cart
    this.post(
      "/",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      saveCart
    );

    // Get cart products by id
    this.get(
      "/:cid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      getCartProducts
    );

    // Add products to cart
    this.post(
      "/:cid/products/:pid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      addToCart
    );

    // Delete product from cart
    this.delete(
      "/:cid/products/:pid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      deleteProdFromCart
    );

    // Update cart
    this.put(
      "/:cid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER],
      updateCart
    );

    // Update cart products' quantity
    this.put(
      "/:cid/products/:pid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER],
      updateProdQuant
    );

    // Delete cart products
    this.delete(
      "/:cid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER],
      deleteCartProds
    );

    // Purchase cart products
    this.get(
      "/:cid/purchase",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      purchaseCart
    );
  }
}
