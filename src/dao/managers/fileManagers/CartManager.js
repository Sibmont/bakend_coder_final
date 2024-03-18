import fs from "fs";
import path from "node:path";
import { __dirname } from "../../../utils.js";
import ProductManager from "./ProductManager.js";

const productsFile = path.join(__dirname, "../files/Products.json");
const productManager = new ProductManager(productsFile);

class NoCartsError extends Error {
  constructor() {
    super("No carts available, file has been created");
    this.name = "NoCartsError";
  }
}
class CartNotFoundError extends Error {
  constructor() {
    super("Cart not found");
    this.name = "CartNotFoundError";
  }
}
class ProductNotFoundError extends Error {
  constructor() {
    super("Product not found");
    this.name = "ProductNotFoundError";
  }
}

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  getAll = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data === "") {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify([], null, "\t")
          );
          throw new NoCartsError();
        }
        const carts = JSON.parse(data);

        return { status: "Success", carts };
      } else {
        // fs.createWriteStream(this.path);
        await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"));
        throw new NoCartsError();
      }
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };

  create = async () => {
    try {
      const result = await this.getCarts();
      const carts = result.carts;

      const newCart = { products: [] };
      carts.length === 0
        ? (newCart.id = 1)
        : (newCart.id = carts[carts.length - 1].id + 1);

      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

      return { status: "Success", message: "Cart created successfully" };
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };

  getById = async (id) => {
    try {
      const result = await this.getCarts();
      const carts = result.carts;

      if (carts.length > 0) {
        const selectedCart = carts.findIndex((c) => c.id === id);
        if (selectedCart > -1) {
          const selectedCartProducts = carts[selectedCart].products;
          return { status: "Success", products: selectedCartProducts };
        } else {
          throw new CartNotFoundError();
        }
      } else {
        throw new NoCartsError();
      }
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };

  addToCart = async (cid, pid) => {
    try {
      // Retrieve carts
      const cartsResult = await this.getCarts();
      const carts = cartsResult.carts;
      // Retrieve products from Products.json
      const productsResult = await productManager.getProducts();
      const products = productsResult.products;

      if (products === undefined) {
        throw new ProductNotFoundError();
      }
      const productToAdd = products.findIndex((p) => p.id === pid);
      if (productToAdd === -1) {
        throw new ProductNotFoundError();
      }

      // Add product id to cart
      const cartToAddTo = carts.find((c) => c.id === cid);
      if (!cartToAddTo) {
        throw new CartNotFoundError();
      }
      const cartProducts = cartToAddTo.products;
      const existingProduct = cartProducts.findIndex((p) => p.product === pid);

      if (existingProduct === -1) {
        cartProducts.push({ product: products[productToAdd].id, quantity: 1 });
      } else {
        cartProducts[existingProduct].quantity += 1;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return { status: "Success", cart: cartProducts };
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };
}
