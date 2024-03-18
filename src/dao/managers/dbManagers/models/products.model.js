import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: Array,
    default: [],
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: { user: { type: mongoose.Schema.Types.ObjectId, ref: "users" } },
  },
});

productsSchema.plugin(mongoosePaginate);

productsSchema.pre(["find", "findById"], function () {
  this.populate("owner");
});

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;
