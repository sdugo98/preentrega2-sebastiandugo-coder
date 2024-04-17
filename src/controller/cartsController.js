import { cartsService } from "../services/carts.Service.js";
import mongoose from "mongoose";
import { io } from "../app.js";
import { productsService } from "../services/products.Service.js";
import { ticketService } from "../services/ticket.Service.js";
import { v4 } from "uuid";
import { CustomError } from "../utils/customError.js";
import { ERRORES_INTERNOS, STATUS_CODES } from "../utils/tiposError.js";

function idValid(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return CustomError.CustomError('Error al validar ID', 'ID Invalido', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS);
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

      return{
        carts,
      };
    } catch (error) {
      console.error("Error al renderizar la vista:", error);
      return CustomError.CustomError('Error al renderizar', 'Error al renderizar', STATUS_CODES.NOT_FOUND,ERRORES_INTERNOS.OTROS)
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
        return null
      }
/*      let total = 0
    getCart.products.forEach(product => {
      const subtotal = product.product.price * product.quantity;
      total += subtotal;
    }); 
    console.log('ESTE ES GET CART ' + getCart) */

     return getCart
    } catch (error) {
      return res.status(500).json({
        Error: CustomError.CustomError('NO SE ENCONTRO CARRITO', 'NO SE ENCONTRO CARRITO', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS)
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

      if(product.stock <= 0){
        console.log('No contamos con stock ')
        return null
      }

      
      
      let cartMod = await cartsService.addProductInCart(cid, product);
      if (!cartMod) {
        console.log("fallo el agregado de producto");
        return null;
      }
/* 
/*       let body = {stock: product.stock -1} 

      let saveModProduct = productsService.updateProduct(pid/* , body )
      console.log('stock actualizado')
       */
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
      return CustomError.CustomError('Internal error', 'error interno', STATUS_CODES.ERROR_SERVER,ERRORES_INTERNOS.INTERNAL)
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

static async confirmBuy(req, res) {
  try {
    let user = req.user
    let { cid } = req.params;
    let valid = idValid(cid, res);
    if (valid) {
      console.log("cid invalido");
      return null;
    }

    let cart = await cartsService.getCartById(cid);

    if (!cart) {
      console.log('Fallo al obtener el carrito');
      return null;
    }

    if (!cart.products || cart.products.length === 0) {
      console.log('El carrito está vacío');
      return null;
    }

    let prodOK = [];
    let prodCancel = [];

    for (const p of cart.products) {
      let id = p.product._id
      let prodsBD = await productsService.getProductById(id);
      let stock = prodsBD.stock - p.quantity;

      if (stock < 0) {
        console.log(`Stock INSUFICIENTE de producto: ${p.product.title}`);
        prodCancel.push(p);
      } else {
        prodOK.push(p);
        let prodMod = await productsService.updateProduct(p.product._id, { stock: stock });
        if (!prodMod) {
          console.log('Error al actualizar stock');
          return null;
        }
      }
    }
/* for of, para podeer usar await */
    for (const prod of prodOK) {
      let clearCart = await cartsService.deleteProductInCart(cid, prod.product._id);
      if (!clearCart) {
        console.log('Error al eliminar producto del carrito');
        return null;
      }
    }

    prodOK.forEach((prod) => {
      prod.subtotal = (prod.product.price * prod.quantity).toFixed(2);
    });

    const total = prodOK.reduce((acc, prod) => acc + parseFloat(prod.subtotal), 0).toFixed(2);

    let ticket = await ticketService.createTicket({code: v4(),amount:total, purchaser: user.email});
    req.ticket =ticket
    if (!ticket) {
      console.log('Error al crear el ticket');
      return null;
    }
    
    return res.status(200).json({ ticket:ticket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}


}