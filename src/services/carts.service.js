import dataSources from "../dao/managers/factory.js";
import CartsRepo from "../repositories/carts.repo.js";
import ProductsRepo from "../repositories/products.repo.js";

const CartsDao = new dataSources.carts();
const cartsRepo = new CartsRepo(CartsDao);

const ProductsDao = new dataSources.products();
const productsRepo = new ProductsRepo(ProductsDao);

const getCarts = async () => {
  const carts = await cartsRepo.getCarts();
  return carts;
};

const saveCart = async (cart) => {
  return await cartsRepo.createCart(cart);
};

const getCartProducts = async (cid) => {
  return await cartsRepo.getCartById(cid);
};

const addToCart = async (cid, pid) => {
  return await cartsRepo.addProdToCart(cid, pid);
};

const deleteProdFromCart = async (cid, pid) => {
  return await cartsRepo.deleteProdFromCart(cid, pid);
};

const updateCart = async (cid, update) => {
  return await cartsRepo.updateCart(cid, update);
};

const updateProdQuant = async (cid, pid, quantity) => {
  return await cartsRepo.updateProdQuantCart(cid, pid, quantity);
};

const deleteCartProds = async (cid) => {
  return await cartsRepo.deleteProdsFromCart(cid);
};

const purchaseCart = async (cid) => {
  const cartToBuy = await cartsRepo.getCartById(cid);
  const cartProducts = cartToBuy.payload;

  const productsForPurchase = [];
  const productsNotBought = [];

  cartProducts.forEach(async (item) => {
    if (item.product.stock >= item.quantity) {
      item.product.stock -= item.quantity;
      productsForPurchase.push(item);
      await productsRepo.updateProduct(item.product._id, {
        stock: item.product.stock,
      });
    } else if (item.product.stock < item.quantity) {
      productsNotBought.push(item);
    }
  });

  const totalPrice = productsForPurchase.reduce((accum, currentProd) => {
    const productPrice = currentProd.product.price * currentProd.quantity;

    return accum + productPrice;
  }, 0);

  await cartsRepo.updateCart(cid, { products: productsNotBought });

  const result = {
    purchased: productsForPurchase,
    notPurchased: productsNotBought,
    amount: totalPrice,
  };

  return {
    status: "Success",
    message: "Products purchased successfully",
    payload: result,
  };
};

export {
  addToCart,
  deleteCartProds,
  deleteProdFromCart,
  getCartProducts,
  getCarts,
  purchaseCart,
  saveCart,
  updateCart,
  updateProdQuant,
};
