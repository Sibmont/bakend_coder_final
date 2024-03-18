import {
  deleteUsers as deleteUsersService,
  getUsers as getUsersService,
} from "../services/users.service.js";

import logger from "../config/logger.js";

const getUsers = async (req, res) => {
  try {
    const result = await getUsersService();

    logger.info("Users fetched successfully");

    return res.sendSuccess(result);
  } catch (error) {
    logger.error(error);
    return res.sendServerError(error);
  }
};

const deleteUsers = async (req, res) => {
  try {
    const result = await deleteUsersService();

    logger.info("Inactive users deleted successfully");

    return res.sendSuccess(result);
  } catch (error) {
    logger.error(error);
    return res.sendServerError(error);
  }
};

export { deleteUsers, getUsers };
