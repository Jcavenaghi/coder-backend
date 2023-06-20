import fs from 'fs';

class CartMemory {

    getAllCarts = async (path) => {
        const data = await fs.promises.readFile(path, 'utf-8');
        const carts = JSON.parse(data);
        return carts;
    }

    addCart = async (path) => {
        const carts = await this.getAllCarts(path);
        let cart = { id: this.#generarId(carts), products: []};
        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, `\t`))
    }

    getProductsByCartId = (carts, id) => {
        let i = carts.findIndex(cart => cart.id === id)
        return carts[i].products;
    }

    getCartById(carts, id) {
        let i = carts.findIndex(cart => cart.id === id)
        return carts[i];   
    }

    addNewProduct = async (cart, pid,path) => {
        const product = cart.products.find(item => item.id === pid)
        product.quantity++;
        const carts = await this.getAllCarts(path)
        await fs.promises.writeFile(path, JSON.stringify(carts, null, `\t`))
        return cart;
    }

    addExistingProduct = async (cart, pid, path) => {
        cart.products.push({"id": pid, "quantity": 1})
        const carts = await this.getAllCarts(path)
        await fs.promises.writeFile(path, JSON.stringify(carts, null, `\t`))
        return cart;
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

export default new CartMemory();
