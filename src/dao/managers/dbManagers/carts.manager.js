import cartsModel from "./models/carts.model.js";

export default class dbCartManager {
  constructor() {
    console.log("Working with DB Cart Manager");
  }

  getAll = async () => {
    const result = await cartsModel.find();

    return { status: "Success", payload: result };
  };

  create = async (cart) => {
    const result = await cartsModel.create(cart);

    return { status: "Success", payload: result };
  };

  getById = async (cid) => {
    const cart = await cartsModel
      .findById(cid)
      .populate("products.product")
      .lean();

    const result = cart.products;

    return { status: "Success", payload: result };
  };

  addToCart = async (cid, pid) => {
    const cart = await cartsModel.findById(cid);

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === pid
    );

    if (productIndex !== -1) {
      // Product already exists, increment its quantity
      cart.products[productIndex].quantity += 1;
    } else {
      // Product doesn't exist, add a new entry
      cart.products.push({ product: pid, quantity: 1 });
    }

    const result = await cartsModel.updateOne({ _id: cid }, cart);

    return {
      status: "Success",
      message: "Product added to cart",
      payload: result,
    };
  };

  deleteProd = async (cid, pid) => {
    const result = await cartsModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { product: pid } } },
      { new: true }
    );

    return {
      status: "Success",
      message: "Product removed from cart",
      payload: result,
    };
  };

  updateCart = async (cid, update) => {
    const result = await cartsModel.findOneAndUpdate({ _id: cid }, update, {
      new: true,
    });

    return { status: "Success", message: "Product updated", payload: result };
  };

  updateProdQuant = async (cid, pid, quantity) => {
    const result = await cartsModel.updateOne(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } }
    );

    if (result.modifiedCount === 1) {
      return {
        status: "Success",
        message: "Product's quantity updated",
        payload: result,
      };
    } else {
      return {
        status: "Success",
        message: "No product's quantity was updated",
        payload: result,
      };
    }
  };

  deleteCartProds = async (cid) => {
    const result = await cartsModel.updateOne({ _id: cid }, { products: [] });

    if (result.modifiedCount === 1) {
      return {
        status: "Success",
        message: "Cart products deleted",
        payload: result,
      };
    } else {
      return {
        status: "Success",
        message: "No products deleted",
        payload: result,
      };
    }
  };
}
