import { cartsService } from "../services/carts.Service.js";
import mongoose from "mongoose";
import { io } from "../app.js";
import { productsService } from "../services/products.Service.js";

function idValid(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = "Ingrese un Id Valido";
    console.log("error al validar");
    return res.redirect(`/errorHandlebars/?error=${error}`);
  }
}
export class CartsController {
  constructor() {}

  static async render(req, res) {
    try {
      let carts = await cartsService.getCarts();
      if (carts.length <= 0) {
        console.log("NO HAY CARTS EN BD");
      }

      if (req.query.limit) {
        carts = carts.slice(0, req.query.limit);
        console.log(`Se estableció un límite de: ${req.query.limit}`);
      }

      res.status(200).render("viewCarts", {
        carts,
      });
    } catch (error) {
      console.error("Error al renderizar la vista:", error);
      res.status(500).json(error.message);
    }
  }

  static async getCartById(req, res) {
    try {
      let { id } = req.params;
      let valid = idValid(id, res);
      if (valid) {
        return null;
      }

      let getCart = await cartsService.getCartById(id);
      if (!getCart) {
        console.log("Error en la búsqueda por ID");
        return null;
      }

      res.status(200).render("viewDetailCarts", { cart: getCart });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async addProductInCart(req, res) {
    try {
      let { cid } = req.params;
      let valid = idValid(cid, res);
      if (valid) {
        console.log("cid invalido");
        return null;
      }
      let { pid } = req.params;
      let validpid = idValid(pid, res);
      if (validpid) {
        console.log("pid invalido");
        return null;
      }
      const product = await productsService.getProductById(pid);
      if (!product) {
        console.log("error en recuperacion de producto");
        return null;
      }

 
      let cartMod = await cartsService.addProductInCart(cid, product);
      if (!cartMod) {
        console.log("fallo el agregado de producto");
        return null;
      }
      console.log("carro modificado: " + cartMod);
      return res.status(200).json({ cartMod });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createCart(req, res) {
    try {
      let { title } = req.body;
      if (!title) {
        return "Coloque un titulo";
      }

      let createCart = await cartsService.createCart(title);
      if (!createCart) {
        return res.status(404).json({ error: "error al crear" });
      }

      io.emit("listCarts", await cartsService.getCarts());
      return res.status(200).json("Carrito Creado" + createCart.title);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteProductInCart(req,res){
    try {
      let { cid } = req.params;
      let valid = idValid(cid, res);
      if (valid) {
        console.log("cid invalido");
        return null;
      }
      let { pid } = req.params;
      let validpid = idValid(pid, res);
      if (validpid) {
        console.log("pid invalido");
        return null;
      }
      const product = await productsService.getProductById(pid);
      if (!product) {
        console.log("error en recuperacion de producto");
        return null;
      }
  
      let cartMod = await cartsService.deleteProductInCart(cid, product);
      if (!cartMod) {
        console.log("fallo el borrado de producto");
        return null;
      }
      console.log("carro modificado: " + cartMod);
      return res.status(200).json({ cartMod });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

static async deleteAllProductsInCart(req,res){
  try {
    let { cid } = req.params;
    let valid = idValid(cid, res);
    if (valid) {
      console.log("cid invalido");
      return null;
    }

    let cartMod = await cartsService.deleteAllProductsInCart(cid);
    if (!cartMod) {
      console.log("fallo el borrado de producto");
      return null;
    }
    console.log("carro modificado: " + cartMod);
    return res.status(200).json({ cartMod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

  static async updateCart(req,res){
    try {
      let { id } = req.params;
      let valid = idValid(id);
      if (valid) {
        return null;
      }
  
      console.log('body en router: '+req.body)
  
      if (req.body._id) {
        return res.status(404).json({ error: "no se puede modificar la propiedad _id" });
      }
  
      let putCart = await cartsService.updateCart(id,req.body);
      if (!putCart) {
        res.status(404).json({ error: "error al modificar" });
        return null;
      }
      io.emit("listCarts", await cartsService.getCarts());
      return res.status(200).json({ putCart });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

static async modifiedProductInCart(req,res){
  try {
    let { cid } = req.params;
    let valid = idValid(cid, res);
    if (valid) {
      console.log("cid invalido");
      return null;
    }
    let { pid } = req.params;
    let validpid = idValid(pid, res);
    if (validpid) {
      console.log("pid invalido");
      return null;
    }

    let quantity
    if(req.body.quantity && Number(req.body.quantity)> 0){
      quantity = (req.body.quantity)
    }else{ 
      return res.status(404).json({error: 'Debes colocar una cantidad en numero y mayor a 0'})
    }

    console.log('quantity: ' + quantity)

    const product = await productsService.getProductById(pid);
    if (!product) {
      console.log("error en recuperacion de producto");
      return null;
    }

    let cartMod = await cartsService.modifiedProductInCart(cid, product, quantity);
    if (!cartMod) {
      console.log("fallo la modificacion de producto");
      return null;
    }
    console.log("carro modificado: " + cartMod);
    return res.status(200).json({ cartMod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

}
