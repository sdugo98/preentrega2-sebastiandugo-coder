import { cartsModel } from "../dao/models/cartsModel.js";
import { CustomError } from "../utils/customError.js";
import { ERRORES_INTERNOS, STATUS_CODES } from "../utils/tiposError.js";

export class CartsDAO{
    constructor(){}
    async getCarts() {
        try {
          let carts = await cartsModel.find({ status: true });
          return carts;
        } catch (error) {
          console.log(error.message);
          return [];
        }
      }

      async getCartById(cartId) {
        let getCart;
        try {
          getCart = await cartsModel.findOne({ status: true, _id: cartId }).populate('products.product');
          console.log("Carrito encontrado por id" + getCart);
          return getCart;
        } catch (error) {
          console.log("No se encontro carrito con Id:" + cartId);
          return CustomError.CustomError('NO SE ENCONTRO CARRITO', 'NO SE ENCONTRO CARRITO', STATUS_CODES.ERROR_DATOS_ENVIADOS, ERRORES_INTERNOS.OTROS)
        }
      }


       async addProductInCart(cid, product) {
        try {
          let getCart = await cartsModel.findOne({ status: true, _id: cid });
          if (!getCart) {
            console.log("no se encontro carrito");
            return null;
          }
      
      
          if (!getCart.products || !Array.isArray(getCart.products)) {
            console.log("La estructura de productos en el carrito es incorrecta");
            return null;
          }
      
        let productInCart = getCart.products.find(
            (prod) => prod.product._id.equals(product._id)
          );
          
      
          if (productInCart) {
            productInCart.quantity++;
          } else {
            getCart.products.push({
              product: product._id,
              quantity: 1,
            });
          }
          try {
            let cartMod = await cartsModel.updateOne(
              { _id: cid },
              { products: getCart.products }
              );
            console.log(cartMod);
            if (cartMod.modifiedCount > 0) {
              console.log("Modificado");
              let cart = await cartsModel.findOne({ _id: cid })/* .populate('products.product') */ 
              return cart;
            }
          } catch (error) {
            console.log("error al modificar", error);
            return null;
          }
        } catch (error) {
          console.log(error.message);
          return null;
        }
      }
         
      async createCart(title) {
        try {
          let newCart = await cartsModel.create({ title: title });
          return newCart;
        } catch (error) {
          console.log("error al crear", error.message);
          return null;
        }
      }

      async deleteProductInCart(cid, product){
        try {
          let getCart = await cartsModel.findOne({ status: true, _id: cid });
          if (!getCart) {
            console.log("no se encontro carrito");
            return null;
          }
      
          console.log("carrito: " + getCart);
      
          if (!getCart.products || !Array.isArray(getCart.products)) {
            console.log("La estructura de productos en el carrito es incorrecta");
            return null;
          }
      
          let productInCart = getCart.products.find(
            (prod) => prod.product._id.toString() === product._id.toString()
          );
    
          if(!productInCart){
            console.log('prodcuto inexistente en carrito')
            return null
          }
    
          try {
            let cartMod = await cartsModel.updateOne(
              { _id: cid },
              { $pull: { products: { product: product} } }
            );
            
            console.log(cartMod);
            if (cartMod.modifiedCount > 0) {
              console.log("Modificado");
              let cart = await cartsModel.findOne({ _id: cid })/* .populate('products.product')  */
              return cart;
            }
          } catch (error) {
            console.log("error al modificar", error);
            return null;
          }
          
      }catch(error){
        console.log(error.message);
        return null;
      }
    }
    async deleteAllProductsInCart(cid){
      try {
        let getCart = await cartsModel.findOne({ status: true, _id: cid });
        if (!getCart) {
          console.log("no se encontro carrito");
          return null;
        }
    
        console.log("carrito: " + getCart);
    
        if (!getCart.products || !Array.isArray(getCart.products)) {
          console.log("La estructura de productos en el carrito es incorrecta");
          return null;
        }
    
        try {
          let cartMod = await cartsModel.updateOne(
            { _id: cid },
            { $pull: { products: { object: getCart.products.object} } }
          );
          
          console.log(cartMod);
          if (cartMod.modifiedCount > 0) {
            console.log("Modificado");
            let cart = await cartsModel.findOne({ _id: cid })/* .populate('products.product')  */
            return cart;
          }
        } catch (error) {
          console.log("error al modificar", error);
          return null;
        }
        
    }catch(error){
      console.log(error.message);
      return null;
    }
    }
    async updateCart(cid, body) {
      try {
          const existingCart = await cartsModel.findOne({ status: true, _id: cid });
          if (!existingCart) {
              console.log('No se encontro Carrito con Id:' + cid);
              return null;
          }
    
          // REPLACEONE SEGUN DOCUMENTTACION, ES PRA MODIFICAR UN DOCUMENTO ENTERO, POR ESO LO USAMOS EN LUGAR DE UPDATE
          const updatedCart = await cartsModel.replaceOne({ _id: cid }, body);
    
          if (updatedCart.modifiedCount > 0) {
              console.log('Modificado');
              return updatedCart;
          } else {
              console.log('Ningún campo fue modificado');
              return null;
          }
      } catch (error) {
          console.log('Error en Update:', error.message);
          return null;
      }
    }
    
    async modifiedProductInCart(cid,product, quantity){
      console.log("entro a Modificar product");
      try {
        let getCart = await cartsModel.findOne({ status: true, _id: cid });
        if (!getCart) {
          console.log("no se encontro carrito");
          return null;
        }
    
        console.log("carrito: " + getCart);
    
        if (!getCart.products || !Array.isArray(getCart.products)) {
          console.log("La estructura de productos en el carrito es incorrecta");
          return null;
        }
    
        let productInCart = getCart.products.find(
          (prod) => prod.product._id.toString() === product._id.toString()
        );
    
        console.log("productInCart:" + productInCart);
        if (!productInCart) {
          console.log('no existe producto en carrito')
          return null
        }
        
        let quantityProductInCart = (productInCart.quantity)
        
    
        console.log("carro mod " + getCart);
        try {
          /* el operador $ se utiliza como un marcador de posición en las operaciones de actualización
    Se refiere al primer elemento que coincide con la condición de filtrado en el array */
    let cartMod = await cartsModel.updateOne(
      { _id: cid, "products.product": product._id },
      { $set: { "products.$.quantity": quantity } }
    );
    
          console.log(cartMod);
          if (cartMod.modifiedCount > 0) {
            console.log("Modificado");
            let cart = await cartsModel.findOne({ _id: cid })/* .populate('products.product')  */
            return cart;
          }
        } catch (error) {
          console.log("error al modificar", error);
          return null;
        }
      } catch (error) {
        console.log(error.message);
        return null;
      }
    }
    }