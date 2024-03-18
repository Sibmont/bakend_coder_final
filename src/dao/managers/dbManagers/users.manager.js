import usersModel from "./models/users.model.js";

export default class Users {
  constructor() {
    console.log("Working with DB Manager");
  }

  getAll = async () => {
    const result = await usersModel.find();
    return result;
  };

  getByEmail = async (email) => {
    const result = await usersModel.findOne(email).lean();
    return result;
  };

  save = async (user) => {
    const result = usersModel.create(user);
    return result;
  };

  updateLoginDate = async (user) => {
    const result = usersModel.findOneAndUpdate(user, {
      last_login: user.last_login,
    });
    return result;
  };

  deleteMany = async (users) => {
    const result = usersModel.deleteMany(users);
    return result;
  };
}
