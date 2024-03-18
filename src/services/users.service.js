import UsersDto from "../DTOs/users.dto.js";
import dataSources from "../dao/managers/factory.js";
import UsersRepo from "../repositories/users.repo.js";

const usersDao = new dataSources.users();
const usersRepo = new UsersRepo(usersDao);

const getUsers = async () => {
  const users = await usersRepo.getUsers();
  const cleanUsers = [];

  users.forEach((user) => {
    const cleanUser = new UsersDto(user);
    cleanUsers.push(cleanUser);
  });

  return cleanUsers;
};

const deleteUsers = async () => {
  const users = await usersRepo.getUsers();

  const inactiveUsers = [];

  const currentTime = new Date();
  let minutesSinceLastLogin;
  users.forEach((user) => {
    const timeDifference = currentTime - user.last_login;
    const daysSinceLastLogin = timeDifference / (1000 * 60 * 60 * 24);
    if (daysSinceLastLogin >= 2) {
      inactiveUsers.push(user._id);
    }
  });

  const filter = { _id: { $in: inactiveUsers } };

  const result = await usersRepo.deleteUsers(filter);
  return result;
};

export { deleteUsers, getUsers };
