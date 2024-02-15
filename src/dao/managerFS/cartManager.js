import fs from 'fs';
import { __dirname } from "../utils.js"
import path from 'path'

export let ruta = path.join(__dirname,'archivos', 'cart.json')

export class CartManager{
    constructor(ruta) {
        this.path = ruta
        if (fs.existsSync(this.path)) {
          const content = fs.readFileSync(this.path, "utf8");
          this.carts = JSON.parse(content);
        } else {
          this.carts = [];
        }
      }

    createCart(){
        
      let id = 1
      if (this.carts.length > 0) {
        id = this.carts[this.carts.length - 1].id + 1
      }
  
      let newCart = {
        id,
        products: [] 
      }

      this.carts.push(newCart);
      this.saveCartsToFile();
      console.log(`Carrito id:${id} creado.`);
      return this.carts;
      }
      

      getCarts() {
        if (fs.existsSync(this.path)) {
          const content = fs.readFileSync(this.path, "utf8")
          const carts = JSON.parse(content)
          return carts
        } else {
          return []
        }
      }

      getCartById(cartId) {
        return this.carts.find((cart) => cart.id === cartId);
      }
      
      getProductsInCart(id) {
        const carts = this.getCarts();
      
        if (carts.length === 0) {
          return "No existen carritos disponibles.";
        }
      
        const cart = carts.find((cart) => cart.id === id);
      
        if (!cart) {
          return `No existe un carrito con el ID: ${id}`;
        }
      
        return cart
      }

      addProductInCart(cartId, product) {
        let getCartIndex = this.carts.findIndex((cart) => cart.id === cartId);
        if (getCartIndex === -1) {
          return "No existe un carrito con el ID proporcionado.";
        }

        let productInCart = this.carts[getCartIndex].products.find((prod) => prod.product === product.id)

        if (!productInCart){

          this.carts[getCartIndex].products.push({
            product: product.id, 
            quantity: 1
          })

          this.saveCartsToFile();

          return this.carts[getCartIndex]
        }

        productInCart.quantity++

        this.saveCartsToFile();
      
        return this.carts[getCartIndex];
      }
      
      

      
      saveCartsToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
      }
    
  }