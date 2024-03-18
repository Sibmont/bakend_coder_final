// import UsersDto from "../DTOs/users.dto.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { deleteUsers, getUsers } from "../controllers/users.controller.js";
import Users from "../dao/managers/dbManagers/users.manager.js";
import Router from "./router.js";

// const router = Router();

export default class SessionsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    this.get(
      "/",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      getUsers
    );

    this.delete(
      "/",
      passportStrategiesEnum.JWT,
      [accessRolesEnum.PUBLIC],
      deleteUsers
    );
  }
}
