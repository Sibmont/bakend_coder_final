import config from "../../config/config.js";

const persistance = config.persistance;

const dataSources = {};

const initializeMongo = async () => {
  const mongoose = await import("mongoose");
  await mongoose.connect(config.mongoUrl);
};

switch (persistance) {
  case "MONGO":
    console.log("Working with DB");
    await initializeMongo();

    const mongoRouters = ["products", "carts", "users", "tickets"];
    for (const router of mongoRouters) {
      const { default: DataSourceMongo } = await import(
        `./dbManagers/${router}.manager.js`
      );
      dataSources[router] = DataSourceMongo;
    }
    break;

  case "MEMORY":
    console.log("Working with Memory");

    const memoryRouters = ["Cart", "Product"];
    for (const router of memoryRouters) {
      const { dafault: DataSourceMemory } = await import(
        `./fileManagers/${router}Manager.js`
      );
      dataSources[router] = DataSourceMemory;
    }
    break;

  default:
    throw new Error("Invalid persistance configuration");
}

export default dataSources;
