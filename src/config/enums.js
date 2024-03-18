const passportStrategiesEnum = {
  JWT: "jwt",
  GITHUB: "github",
  GITHUB_LOGIN: "github",
  LOCALREGISTER: "register",
  LOCALLOGIN: "login",
  NA: "na",
};

const accessRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
  PUBLIC: "PUBLIC",
};

const EErrors = {
  ROUTING_ERROR: 1,
  INVALID_TYPE_ERROR: 2,
  RESOURCE_NOT_FOUND: 3,
  AUTHORIZATION_ERROR: 4,
  INTERNAL_SERVER_ERROR: 5,
  DATABASE_ERROR: 6,
};

export { EErrors, accessRolesEnum, passportStrategiesEnum };
