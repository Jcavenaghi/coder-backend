import fs from 'fs';
import cartsDao from '../fileSystemDAO/carts.dao.js';

export default class CartManager {
    #privada
    constructor(path) {
        this.path =  path;
    }

    /* Metodos */
    consultarCarts = async () => {
        if (fs.existsSync(this.path)) {
            const carts = cartsDao.getAllCarts(this.path);
            return carts;
        } else {
            return [];
        }
    }
    
    addCart = async () => {
        const cart = await cartsDao.addCart(this.path);
        return cart;
    }

    getProductsByCartId = async (id) => {
        const carts = await this.consultarCarts();
        if (carts.some (cart => cart.id === id)) {
            const products = cartsDao.getProductsByCartId(carts,id);
            return products;
        } else {
            throw new Error("Not Found.")
        } 
    }

    addProductInCartByCartId = async (cid, pid) => {
        const carts = await this.consultarCarts();
        if (carts.some (cart => cart.id === cid)) {
            const cart =  await cartsDao.getCartById(carts, cid)
            if (cart.products.some(item => item.id === pid)) {
                const newCart = cartsDao.addExistingProduct(cart,pid,this.path)
            } else {
                const newCart = cartsDao.addNewProduct(cart,pid,this.path)
            }
            return newCart;
        } else {
            throw new Error("Not Found.")
        } 
    }

}