import fs from 'fs';
import { __dirname } from "../utils.js"
import path from 'path'

export let ruta = path.join(__dirname,'archivos', 'products.json')

export class ProductManager {
  constructor(ruta) {
    this.path = ruta
    this.products = this.getProducts()
  }

  addProduct(title, description, code, price, stock, category, thumbnail) {
    if (!title || !description || !code || !price || !category) {
      return("Faltan campos obligatorios para agregar el producto.")

    }
    const validationProduct = this.products.find(
      (product) => product.code === code
    )

    if (validationProduct) {
      return(
        `El siguiente producto ya existe.
            Codigo: ${code}
            Nombre: ${title}`
      )
      
    }
    let id = 1
    if (this.products.length > 0) {
      id = this.products[this.products.length - 1].id + 1
    }

    let newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnail,
    }

    this.products.push(newProduct)
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"))
    console.log(`Producto "${title}" agregado.`)
    console.log(newProduct)
    return newProduct
  }

  getProducts() {
    if (fs.existsSync(this.path)) {
      const content = fs.readFileSync(this.path, "utf8")
      const products = JSON.parse(content)
      return products
    } else {
      return []
    }
  }

  getProductById(id) {
    let products = this.getProducts()
    let findProductById = products.find((p) => p.id === id)
    if (!findProductById) {
      console.log('Busqueda Fallida')
      return false
    }
      console.log(`Busqueda exitosa! El producto encontrado es: ${findProductById.title}`)
      return findProductById
  }

  saveProducts(products) {
    fs.writeFileSync(ruta, JSON.stringify(products, null, "\t"))
}

updateProduct(id, reqBody) {
  let prodIndex = this.products.findIndex(product => product.id === id);
  if (prodIndex === -1) {
    return console.log('Producto inexistente');
  }

  let propiedadesOk = ["id", "title", "description", "code", "price", "status", "stock", "category", "thumbnail"];
  let propiedadesReq = Object.keys(reqBody);
  let propiedadesInvalidas = propiedadesReq.filter(propiedad => !propiedadesOk.includes(propiedad));
  if (propiedadesInvalidas.length > 0) {
    return console.log('Propiedades invalidas')
  }

  let prodMod = {
    ...this.products[prodIndex],
    ...reqBody,
    id
  };

  this.products[prodIndex] = prodMod;
  this.saveProducts(this.products);

  return prodMod;
}


deleteProduct(id) {
  console.log(id)
  let prodIndex = this.products.findIndex(product => product.id === id);
  if (prodIndex === -1) {
    return console.log('Producto inexistente');
  }

  let deleteProduct = this.products.splice(prodIndex, 1)

  this.saveProducts(this.products)
  return deleteProduct
}}