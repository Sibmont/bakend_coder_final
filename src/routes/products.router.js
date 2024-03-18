// import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import Router from "./router.js";

// New restructuring imports
import {
  deleteProduct,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
} from "../controllers/products.controller.js";

// const router = Router();

export default class ProductsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    // Retrieve all products or a limited set of products
    this.get(
      "/",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      getProducts
    );

    // Retrieve 1 specific product by its id
    this.get(
      "/:pid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      getProductById
    );

    // Add a new product
    this.post(
      "/",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.ADMIN],
      saveProduct
    );

    // Update a product, can pass an entire new product or just update some fields by passing those attributes in the req.body
    this.put(
      "/:pid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.ADMIN],
      updateProduct
    );

    // Delete a product
    this.delete(
      "/:pid",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.ADMIN],
      deleteProduct
    );
  }
}
