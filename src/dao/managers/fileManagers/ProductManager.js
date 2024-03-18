import fs from "fs";

// Error handling
class MissingParametersError extends Error {
  constructor(paramName) {
    super(`Missing required parameter: ${paramName}`);
    this.name = "MissingParametersError";
    this.paramName;
  }
}
class NoProductsError extends Error {
  constructor() {
    super("No products available, file has been created");
    this.name = "NoProductsError";
  }
}
class ProductNotFoundError extends Error {
  constructor() {
    super("Product not found");
    this.name = "ProductNotFoundError";
  }
}
class ExistingProductError extends Error {
  constructor() {
    super("Product already exists");
    this.name = "ExistingProductError";
  }
}
class UpdateIdError extends Error {
  constructor() {
    super("Cannot update product's ID");
    this.name = "UpdateIdError";
  }
}

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getAll = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf8");
        if (data === "") {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify([], null, "\t")
          );
          throw new NoProductsError();
        }
        const products = JSON.parse(data);

        return { status: "Success", products };
      } else {
        await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"));
        throw new NoProductsError();
      }
    } catch (error) {
      return { status: "Error", error: error.message };
    }
  };

  //  El usuario tiene que pasar un objeto con las propiedades listadas abajo
  create = async (product) => {
    try {
      const result = await this.getProducts();
      const products = result.products;

      if (!product.title) throw new MissingParametersError("Title");
      if (!product.description) throw new MissingParametersError("Description");
      if (!product.price) throw new MissingParametersError("Price");
      if (!product.category) throw new MissingParametersError("Category");
      if (!product.code) throw new MissingParametersError("Code");
      if (!product.stock) throw new MissingParametersError("Stock");

      const existingProduct = products.findIndex(
        (p) => p.code === product.code
      );
      if (existingProduct != -1) {
        throw new ExistingProductError();
      }

      product.stock > 0 ? (product.status = true) : (product.status = false);
      products.length === 0
        ? (product.id = 1)
        : (product.id = products[products.length - 1].id + 1);

      products.push(product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return { status: "Success", message: "Product added successfully" };
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };

  getById = async (id) => {
    try {
      const result = await this.getProducts();
      const products = result.products;

      if (products === undefined) {
        throw new ProductNotFoundError();
      }
      if (products.length > 0) {
        const fetchedProduct = products.find((product) => product.id === id);
        if (fetchedProduct) {
          return { status: "Success", product: fetchedProduct };
        } else {
          throw new ProductNotFoundError();
        }
      } else {
        throw new ProductNotFoundError();
      }
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };

  update = async (id, update) => {
    try {
      const result = await this.getProducts();
      const products = result.products;

      let productIndex = products.findIndex((product) => product.id === id);

      if (productIndex > -1) {
        const productToUpdate = products[productIndex];

        const isObjectEmpty = (object) => {
          return (
            object &&
            Object.keys(object).length === 0 &&
            object.constructor === Object
          );
        };

        if (isObjectEmpty(update)) {
          throw new MissingParametersError(
            "Missing desired updates for product"
          );
        }

        if (update.id) {
          if (update.id !== productToUpdate.id) {
            throw new UpdateIdError();
          }
        }

        products[productIndex] = { ...productToUpdate, ...update };

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        return { status: "Success", updatedProduct: products[productIndex] };
      } else {
        throw new ProductNotFoundError();
      }
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };

  delete = async (id) => {
    try {
      const result = await this.getProducts();
      const products = result.products;
      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex > -1) {
        products.splice(productIndex, 1);
        if (products.length === 1) {
          products[0].id = 1;
        }

        const updatedProducts = products
          .filter((product) => product.id !== id)
          .map((p, i) => ({ ...p, id: i + 1 }));

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(updatedProducts, null, "\t")
        );
        return { status: "Success", message: "Product deleted successfully" };
      } else {
        throw new ProductNotFoundError();
      }
    } catch (error) {
      return { status: "Error", message: error.message };
    }
  };
}
