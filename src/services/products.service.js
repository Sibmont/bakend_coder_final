// import Products from "../dao/managers/dbManagers/products.manager.js";
import dataSources from "../dao/managers/factory.js";
import ProductsRepo from "../repositories/products.repo.js";
import UsersRepo from "../repositories/users.repo.js";
import { sendEmail } from "../services/mail.service.js";
import { productDeletetemplate } from "../utils/custom.product.delete.html.js";

const ProductsDao = new dataSources.products();
const productsRepo = new ProductsRepo(ProductsDao);

const usersDao = new dataSources.users();
const usersRepo = new UsersRepo(usersDao);

// const productsManager = new Products();

const getProducts = async (sort, query, queryValue, limit, page) => {
  const products = await productsRepo.getProducts(
    sort,
    query,
    queryValue,
    limit,
    page
  );

  return products;
};

const getProductById = async (pid) => {
  const product = await productsRepo.getProductById(pid);
  if (product.payload.length === 0) {
    return { status: "NF", message: "Product not found" };
  }

  return product;
};

const saveProduct = async (product) => {
  return await productsRepo.createProduct(product);
};

const updateProduct = async (pid, update) => {
  return await productsRepo.updateProduct(pid, update);
};

const deleteProduct = async (pid) => {
  const product = await productsRepo.getProductById(pid);

  const prodOwnerId = product.payload[0].owner._id.toString();

  const users = await usersRepo.getUsers();

  const owner = users.find((user) => user._id.toString() == prodOwnerId);

  if (owner.role === "ADMIN") {
    const emailPremiumProductDelete = {
      to: owner.email,
      subject: "Product deleted",
      html: productDeletetemplate,
    };

    await sendEmail(emailPremiumProductDelete);
  }

  return await productsRepo.deleteProduct(pid);
};

const generateProducts = async () => {
  return await productsRepo.generateProducts();
};

export {
  deleteProduct,
  generateProducts,
  getProductById,
  getProducts,
  saveProduct,
  updateProduct,
};
