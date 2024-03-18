export default class UsersRepo {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  getUserByEmail = async (id) => {
    const result = await this.dao.getByEmail(id);
    return result;
  };

  createUser = async (product) => {
    const result = await this.dao.save(product);
    return result;
  };

  deleteUsers = async (users) => {
    const result = await this.dao.deleteMany(users);
    return result;
  };
}
