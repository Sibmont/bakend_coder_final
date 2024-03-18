export default class CartsRepo {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  getCartById = async (id) => {
    const result = await this.dao.getById(id);
    return result;
  };

  createCart = async (cart) => {
    const result = await this.dao.create(cart);
    return result;
  };

  addProdToCart = async (cid, pid) => {
    const result = await this.dao.addToCart(cid, pid);
    return result;
  };

  updateCart = async (id, update) => {
    const result = await this.dao.updateCart(id, update);
    return result;
  };

  updateProdQuantCart = async (cid, pid, quantity) => {
    const result = await this.dao.updateProdQuant(cid, pid, quantity);
    return result;
  };

  deleteProdFromCart = async (cid, pid) => {
    const result = await this.dao.deleteProd(cid, pid);
    return result;
  };

  deleteProdsFromCart = async (cid) => {
    const result = await this.dao.deleteCartProds(cid);
    return result;
  };
}
