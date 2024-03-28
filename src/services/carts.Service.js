export class CartsService {
    constructor(dao){
        this.dao = new dao()
    }

    async getCarts(){
        return await this.dao.getCarts()
    }

    async getCartById(id){
        return await this.dao.getCartById(id)
    }

    async addProductInCart(cid, product){
        console.log('en service')
        return await this.dao.addProductInCart(cid, product)
    }

    async createCart(title){
        return await this.dao.createCart(title)
    }
    async deleteProductInCart(cid, product){
        return await this.dao.deleteProductInCart(cid,product)
    }
    async deleteAllProductsInCart(cid){
        return await this.dao.deleteAllProductsInCart(cid)
    }
    async updateCart(cid, body){
        return await this.dao.updateCart(cid, body)
    }
    async modifiedProductInCart(cid,product, quantity){
        return await this.dao.modifiedProductInCart(cid,product, quantity)
    }
}
import { CartsDAO } from "../dao/cartsDAO.js"
export const cartsService = new CartsService(CartsDAO)