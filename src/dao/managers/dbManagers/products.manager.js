import { faker } from "@faker-js/faker";
import productsModel from "./models/products.model.js";

export default class dbProductManager {
  constructor() {
    console.log("Working with DB manager");
  }

  getAll = async (sort, query, queryValue, limit, page) => {
    const options = {};

    const search = !query
      ? {}
      : query === "category"
      ? { category: queryValue }
      : query === "stock"
      ? { stock: queryValue ? { $gte: queryValue } : { $gte: 1 } }
      : {};

    const sortQuery = sort ? { price: Number(sort) } : {};

    if (page) {
      options.page = Number(page);
    } else options.page = 1;
    if (limit) {
      options.limit = Number(limit);
    } else options.limit = 10;
    if (sort) {
      options.sort = sortQuery;
    }
    options.lean = true;

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productsModel.paginate(search, options);

    let prevLink = null;
    let nextLink = null;
    if (hasPrevPage) {
      prevLink = `localhost:8080/api/products?page=${prevPage}`;
    }
    if (hasNextPage) {
      nextLink = `localhost:8080/api/products?page=${nextPage}`;
    }

    const result = {
      products: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    return { status: "Success", payload: result };
  };

  getById = async (pid) => {
    const product = await productsModel.find({ _id: pid });

    return { status: "Success", payload: product };
  };

  create = async (product) => {
    const result = await productsModel.create(product);

    return { status: "Success", payload: result };
  };

  update = async (id, update) => {
    const result = await productsModel.updateOne({ _id: id }, update);

    return { status: "Success", payload: result };
  };

  delete = async (id) => {
    const result = await productsModel.deleteOne({ _id: id });

    return { status: "Success", payload: result };
  };

  generate = () => {
    const result = [];
    const product = {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      thumbnail: faker.image.url(),
      code: faker.string.alphanumeric(10),
      stock: faker.number.int(1),
      category: faker.commerce.department(),
    };

    for (let i = 0; i < 100; i++) {
      result.push(product);
    }
    return { status: "Success", payload: result };
  };
}
