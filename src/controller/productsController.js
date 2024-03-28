import { productsService } from "../services/products.Service.js";
import { io } from "../app.js";
import mongoose from "mongoose";

function idValid(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = "Ingrese un Id Valido";
    console.log("error al validar");
    return res.redirect(`/errorHandlebars/?error=${error}`);
  }
}

export class ProductsController {
  constructor() {}

  static async render(req, res) {
    let user = req.user;
    let error;
    if (req.error) {
      return res.redirect(`/api/products/?error=${req.error}`);
    }
    try {
      let page = 1;
      if (req.query.page) {
        page = req.query.page;
      }
      let category;
      if (req.query.category) {
        category = req.query.category;
      }

      let sort;
      if (req.query.sort) {
        sort = Number(req.query.sort);
      }
      let disp;

      if (req.query.disp === undefined) {
        disp = true;
      } else if (req.query.disp === "true" || req.query.disp === "false") {
        /* compara por cadena de texto, si no es igual a true, lo pone en false */
        disp = req.query.disp === "true";
      } else {
        return res
          .status(400)
          .json({ error: "Debe ser un dato tipo boolean (true o false)" });
      }

      let products = await productsService.getProducts(
        req.query.limit,
        page,
        category,
        sort,
        disp
      );
      if (products.length <= 0) {
        console.log("NO HAY PRODUCTS EN BD");
      }

      res.status(200).render("viewProducts", {
        error: error,
        user: user,
        products: products.docs,
        totalPages: products.totalPages,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        sort: sort,
      });
    } catch (error) {
      console.error("Error al renderizar la vista:", error);
      res.status(500).json(error.message);
    }
  }

  static async getProductById(req, res) {
    try {
      let { id } = req.params;
      let valid = idValid(id, res);
      if (valid) {
        return null;
      }

      let getProductById = await productsService.getProductById(id);
      if (!getProductById) {
        console.log("Error en busqueda por ID");
        return null;
      }
      res.status(200).render("viewDetailProduct", { getProductById });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async createProduct(req, res) {
    try {
      let { title, description, code, price, stock, category, thumbnail } =
        req.body;

      console.log(title);

      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({
          error: "Faltan campos obligatorios para agregar el producto.",
        });
      }

      let exReg = /[0-9]/;
      if (
        exReg.test(title) ||
        exReg.test(description) ||
        exReg.test(category)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Controlar error numerico en  los siguientes campos: title, description, code, category",
          });
      }

      let confirmCreateProduct = await productsService.createProduct(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail
      );
      if (!confirmCreateProduct) {
        return res.status(404).json({
          error: "error al crear",
        });
      }

      io.emit("listProduct", await productsService.getProducts());
      return res.status(200).json({
        confirmCreateProduct,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }


  static async updateProduct(req,res){
    try {
      let {
        id
      } = req.params;
      let valid = idValid(id);
      if (valid) {
        return null;
      }
  
      let getProductById = await productsService.getProductById(id);
      if (!getProductById) {
        console.log("Error en busqueda por ID");
        return null;
      }
  
      if (req.body._id) {
        return res.status(400).json({
          error: "no se puede modificar la propiedad _id"
        });
      }
  
      let putProduct = await productsService.updateProduct(id, req.body);
      if (!putProduct) {
        res.status(404).json({
          error: "error al modificar"
        });
        return null;
      }
      io.emit("listProduct", await productsService.getProducts());
      return res.status(200).json({
        putProduct
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

static async deleteProduct(req,res){
  try {
    let {
      id
    } = req.params;
    let valid = idValid(id);
    if (valid) {
      return null;
    }

    let getProductById = await productsService.getProductById(id);
    if (!getProductById) {
      console.log("Error en busqueda por ID");
      return null;
    }

    let prodDeleted = await productsService.deleteProduct(id)

    if (!prodDeleted) {
      console.log("error en eliminacion");
      return null;
    }
    io.emit("listProduct", await productsService.getProducts());
    return res.status(200).json({
      prodDeleted
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}


}
