export default class ProductsRepo {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  getProductById = async (id) => {
    const result = await this.dao.getById(id);
    return result;
  };

  createProduct = async (product) => {
    const result = await this.dao.create(product);
    return result;
  };

  updateProduct = async (id, update) => {
    const result = await this.dao.update(id, update);
    return result;
  };

  deleteProduct = async (id) => {
    const result = await this.dao.delete(id);
    return result;
  };

  generateProducts = async () => {
    const result = await this.dao.generate();
    return result;
  };
}
