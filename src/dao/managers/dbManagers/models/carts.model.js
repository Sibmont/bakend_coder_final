import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

cartsSchema.pre(["find", "findById"], function () {
  this.populate("products.product");
  this.populate("user");
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
