import { GetCartDto } from "../dao/dto/cart.dto.js";


export class CartRepository{
    constructor(dao){
        this.dao = dao;
    };
    async addQuantityOfProduct(cid,pid,quantity) {
        const cart = await this.dao.updateCartById(cid,pid,quantity);
        return cart;
    }
    
    async addProducts(cid, products) {
        const cart = await this.dao.addProducts(cid, products);
        return cart
    }
    async addOneProduct(cid,pid) {
        const cart = await this.dao.addProduct(cid,pid);
        return cart;
    }
    async createCart(items){
        const cartCreated = await this.dao.addCart(items);
        return cartCreated;
    };

    async getCart(id){
        const cart = await this.dao.getCart(id);
        const cartDto = new GetCartDto(cart);
        return cartDto;
    };

    async deleteAllProducts(cid) {
        const carts = await this.dao.deleteAllProducts(cid);
        return carts;
    }

    async deleteProduct(cid,pid) {
        const result = await this.dao.deleteProduct(cid,pid);
        return result;
    }
}