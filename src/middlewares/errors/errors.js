import { EErrors } from "../../config/enums.js";
import logger from "../../config/logger.js";

export default (error, req, res, next) => {
  console.log("Custom error middleware triggered");
  logger.error(`${error.name} - ${error.message}`);
  switch (error.code) {
    case EErrors.ROUTING_ERROR:
      res.status(404).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    case EErrors.INVALID_TYPE_ERROR:
      res.status(400).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    case EErrors.RESOURCE_NOT_FOUND:
      // console.error(error);
      res.status(404).send({
        status: "error",
        error: error.name,
        description: error.cause,
        message: error.message,
      });
      break;
    case EErrors.AUTHORIZATION_ERROR:
      res.status(403).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    case EErrors.INTERNAL_SERVER_ERROR:
      res.status(500).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    case EErrors.DATABASE_ERROR:
      res.status(503).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    default:
      res.status(500).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
  }

  next();
};
