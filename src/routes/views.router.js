import { Router } from "express";
import path from "node:path";
import dbCartManager from "../dao/managers/dbManagers/carts.manager.js";
import dbProductManager from "../dao/managers/dbManagers/products.manager.js";
import ProductManager from "../dao/managers/fileManagers/ProductManager.js";
import { generateProducts } from "../services/products.service.js";
import { __dirname } from "../utils.js";

const router = Router();

const filesPath = path.join(__dirname, "../files/Products.json");
const manager = new ProductManager(filesPath);
const dbProdManager = new dbProductManager();
const dbCart = new dbCartManager();

const publicAccess = (req, res, next) => {
  if (req.session?.user) return res.redirect("/products");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/login");
  next();
};

router.get("/register", publicAccess, (req, res) => {
  res.render("register");
});

router.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/", (req, res) => {
  res.render("login");
});

// -----File products view-----
// const products = await manager.getProducts();
// router.get("/", async (req, res) => {
//   try {
//     res.render("home", products);
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ status: "Error", error: "Internal Server Error" });
//   }
// });

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts", products);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

router.get("/products", privateAccess, async (req, res) => {
  try {
    const result = await dbProdManager.getAll();
    const dbProducts = result.payload.products;

    const cartsResult = await dbCart.getAll();

    const userCart = cartsResult.payload.find(
      (cart) => cart.user.email === req.session.user.email
    );

    res.render("products", {
      products: dbProducts,
      user: req.session.user,
      cartProds: userCart.products,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const cartsResult = await dbCart.getAll();

    const userCart = cartsResult.payload.find(
      (cart) => cart.user.email === req.session.user.email
    );

    const cid = userCart._id;
    const result = await dbCart.getById(cid);
    let totalPrice = 0;
    if (userCart) {
      totalPrice = userCart.products.reduce((accum, currentProd) => {
        const productPrice = currentProd.product.price * currentProd.quantity;
        return accum + productPrice;
      }, 0);
    }

    res.render("cart", { products: result.payload, totalPrice });
  } catch (error) {
    return res.status(500).send({ status: "Error", message: error.message });
  }
});

router.get("/mockingproducts", async (req, res) => {
  try {
    const result = await generateProducts();
    res.send(result);
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Error", error: "Internal Server Error" });
  }
});

router.get("/checkout", privateAccess, async (req, res) => {
  try {
    // Retrieve user's cart
    const cartsResult = await dbCart.getAll();
    const userCart = cartsResult.payload.find(
      (cart) => cart.user.email === req.session.user.email
    );

    // Calculate total price
    let totalPrice = 0;
    if (userCart) {
      totalPrice = userCart.products.reduce((accum, currentProd) => {
        const productPrice = currentProd.product.price * currentProd.quantity;
        return accum + productPrice;
      }, 0);
    }

    res.render("checkout", {
      user: req.session.user,
      cartProds: userCart ? userCart.products : [],
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error("Error rendering checkout:", error);
    res.status(500).send({ status: "Error", error: "Internal Server Error" });
  }
});

export default router;
