import { productsModel } from "../models/productsModel.js";

export class ManagerProducts {
  async getProducts(limit, page, category, sort, disp) {
    try {
      /* establecemos un parametro general para simplificar luego simplicar el metodo a mongoose-- Idea de documentacion */
      let query;

      if (disp !== undefined) {
        query = { status: Boolean(disp) };
      }

      if (category) {
        query.category = category;
      }
      /* establecemos un parametro general para simplificar luego simplicar el metodo a mongoose */
      let options = {
        page: page || 1,
        limit: limit || 10,
      };

      if (sort) {
        options.sort = { price: sort };
      }

      let products = await productsModel.paginate(query, options);
      return products;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  async createProduct(
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail
  ) {
    try {
      let newProduct = await productsModel.create({
        title: title,
        description: description,
        code: code,
        price: Number(price),
        stock: Number(stock),
        category: category,
        thumbnail: thumbnail,
      });
      return newProduct;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getProductById(id) {
    console.log("entro a buscar");
    let getProduct;
    try {
      getProduct = await productsModel.findOne({ status: true, _id: id });
      console.log("producto encontrado por id" + getProduct);
      return getProduct;
    } catch (error) {
      console.log("No se encontro Producto con Id:" + id);
      return null;
    }
  }

  async updateProduct(id, body) {
    try {
      const existingProduct = await productsModel.findOne({
        status: true,
        _id: id,
      });
      if (!existingProduct) {
        console.log("No se encontro Producto con Id:" + id);
        return null;
      }

      /* Uso operadores, que dimos en clase $set */
      const updatedProduct = await productsModel.updateOne(
        { _id: id },
        { $set: body }
      );

      if (updatedProduct.modifiedCount > 0) {
        console.log("Modificado");
        return updatedProduct;
      } else {
        console.log("Ningún campo fue modificado");
        return null;
      }
    } catch (error) {
      console.log("Error en Update:", error.message);
      return null;
    }
  }

  async deleteProduct(id) {
    let getProduct;
    try {
      getProduct = await productsModel.findOne({ status: true, _id: id });
      console.log("producto encontrado por id" + getProduct);

      let prodDeleted;
      try {
        prodDeleted = await productsModel.updateOne(getProduct, {
          $set: { status: false },
        });
        if (prodDeleted.modifiedCount > 0) {
          console.log("Desactivado");
          return prodDeleted;
        }
      } catch (error) {
        console.log("Error en Delete");
        return null;
      }
    } catch (error) {
      console.log("No se encontro Producto con Id:" + id);
      return null;
    }
  }
}