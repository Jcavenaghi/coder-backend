import fs from 'fs';

export default class CartManager {
    #privada
    constructor(path) {
        this.path =  path;
    }

    /* Metodos */
    consultarCarts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    }
    
    addCart = async () => {
        const carts = await this.consultarCarts();
        let cart = { id: this.#generarId(carts), products: []};
        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, `\t`))
        return cart;
    }

    getProductsByCartId = async (id) => {
        const carts = await this.consultarCarts();
        if (carts.some (cart => cart.id === id)) {
            let i = carts.findIndex(cart => cart.id === id)
            return carts[i].products;
        } else {
            throw new Error("Not Found.")
        } 
    }

    addProductInCartByCartId = async (cid, pid) => {
        const carts = await this.consultarCarts();
        if (carts.some (cart => cart.id === cid)) {
            let i = carts.findIndex(cart => cart.id === cid)
            const cart =  carts[i];
            if (cart.products.some(item => item.id === pid)) {
                let product = cart.products.find(item => item.id === pid)
                product.quantity++;
            } else {
                cart.products.push({"id": pid, "quantity": 1})
            }
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, `\t`))
        } else {
            throw new Error("Not Found.")
        } 
    }

    #generarId = (carts) => {
        if (carts.length === 0) {
            return 1
        } else {
            const code = carts[carts.length - 1].id + 1
            return code
        }

    }

}