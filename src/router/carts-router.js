import { Router } from "express";
import { ManagerCarts } from "../dao/managerMongo/managerCartsMongo.js";
import { cartsModel } from "../dao/models/cartsModel.js";
import multer from "multer";
import mongoose from "mongoose";
import { io } from "../app.js";
import { managerProducts } from "./products-router.js";
/* import { auth } from "./viewsRouter.js"; */
export const router = Router();
const managerCarts = new ManagerCarts();
const upload = multer();

function idValid(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: "Ingrese un ID valido",
    });
  }
}

router.get("/"/* , auth */,async (req, res) => {
  try {
    let carts = await managerCarts.getCarts();
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
});

router.get("/:id"/* , auth */,async (req, res) => {
  try {
    let { id } = req.params;
    let valid = idValid(id, res);
    if (valid) {
      return null;
    }

    let getCart = await managerCarts.getCartById(id);
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
});

router.post("/:cid/product/:pid"/* , auth */,async (req, res) => {
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
    const product = await managerProducts.getProductById(pid);
    if (!product) {
      console.log("error en recuperacion de producto");
      return null;
    }

    let cartMod = await managerCarts.addProductInCart(cid, product);
    if (!cartMod) {
      console.log("fallo el agregado de producto");
      return null;
    }
    console.log("carro modificado: " + cartMod);
    return res.status(200).json({ cartMod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/"/* , auth */,upload.none(), async (req, res) => {
  try {
    let { title } = req.body;
    if (!title) {
      return "Coloque un titulo";
    }
    let exReg = /[0-9]/;
    if (exReg.test(title)) {
      return res.status(400).json({
        error:
          'Controlar error numerico',
      });
    }

    let createCart = await managerCarts.createCart(title);
    if (!createCart) {
      return res.status(404).json({ error: "error al crear" });
    }

    io.emit("listCarts", await managerCarts.getCarts());
    return res.status(200).json("Carrito Creado" + createCart.title);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/:cid/product/:pid"/* , auth */,async (req, res) => {
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
    const product = await managerProducts.getProductById(pid);
    if (!product) {
      console.log("error en recuperacion de producto");
      return null;
    }

    let cartMod = await managerCarts.deleteProductInCart(cid, product);
    if (!cartMod) {
      console.log("fallo el borrado de producto");
      return null;
    }
    console.log("carro modificado: " + cartMod);
    return res.status(200).json({ cartMod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/:cid"/* , auth */,async (req, res) => {
  try {
    let { cid } = req.params;
    let valid = idValid(cid, res);
    if (valid) {
      console.log("cid invalido");
      return null;
    }

    let cartMod = await managerCarts.deleteProductsAllInCart(cid);
    if (!cartMod) {
      console.log("fallo el borrado de producto");
      return null;
    }
    console.log("carro modificado: " + cartMod);
    return res.status(200).json({ cartMod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




router.put("/:id"/* , auth */,async (req, res) => {
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

    let putCart = await managerCarts.updateCart(id,req.body);
    if (!putCart) {
      res.status(404).json({ error: "error al modificar" });
      return null;
    }
    io.emit("listCarts", await managerCarts.getCarts());
    return res.status(200).json({ putCart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.put("/:cid/product/:pid"/* , auth */,async (req, res) => {
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

    const product = await managerProducts.getProductById(pid);
    if (!product) {
      console.log("error en recuperacion de producto");
      return null;
    }

    let cartMod = await managerCarts.modifiedProductInCart(cid, product, quantity);
    if (!cartMod) {
      console.log("fallo la modificacion de producto");
      return null;
    }
    console.log("carro modificado: " + cartMod);
    return res.status(200).json({ cartMod });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});