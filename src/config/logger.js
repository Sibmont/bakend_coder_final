import winston from "winston";
import config from "./config.js";

// Multi environment setup
const ENVIRONMENT = config.environment;

let logger;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue",
  },
};

if (ENVIRONMENT === "PROD") {
  // Prod logger
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: "info",
      }),
      new winston.transports.File({
        filename: "logs/errors.log",
        level: "error",
      }),
    ],
  });
} else {
  // Dev logger
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
      winston.format.colorize({
        all: true,
        colors: customLevelOptions.colors,
      }),
      winston.format.timestamp(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console({
        level: "debug",
      }),
    ],
  });
}

export default logger;

// export const appLogger = (req, res, next) => {
//   req.logger = logger;
//   req.logger.info(`${req.method} on ${req.url} - ${new Date().toISOString()}`);
//   next();
// };
