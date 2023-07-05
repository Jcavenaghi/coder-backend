import fs from 'fs';

class ProductMemory {

    getAllProducts = async (path) => {
        const data = await fs.promises.readFile(path, 'utf-8');
        const products = JSON.parse(data);
        return products;
    }

    addProduct = async (path, producto) => {
        const products = await this.getAllProducts(path)
        let prod = { id: this.#generarId(products), status: true, ...producto}
        products.push(prod)
        await fs.promises.writeFile(path, JSON.stringify(products, null, `\t`))
        return prod
    }
    getProductById = async (path,id) => {
        const products = await this.getAllProducts(path)
        let i = products.findIndex(prod => prod.id === id)
        return products[i]
    }
    updateProductById= async (path, indice, fields) => {
        const products = await this.getAllProducts(path)
        if (fields.hasOwnProperty("code")) {
            products[indice].code = fields["code"]
        }
        if (fields.hasOwnProperty("description")) {
            products[indice].description = fields["description"]
        }
        if (fields.hasOwnProperty("status")) {
            products[indice].status = fields["status"]
        }
        if (fields.hasOwnProperty("title")) {
            products[indice].title = fields["title"]
        }
        if (fields.hasOwnProperty("price")) {
            products[indice].price = fields["price"]
        }
        if (fields.hasOwnProperty("stock")) {
            products[indice].stock = fields["stock"]
        }
        if (fields.hasOwnProperty("category")) {
            products[indice].category = fields["category"]
        }
        await fs.promises.writeFile(path, JSON.stringify(products, null, `\t`))
        return products[indice];
    }

    deleteProduct = async (path, i) => {
        const products = this.getAllProducts(path);
        products.splice(i, 1);
        await fs.promises.writeFile(path, JSON.stringify(products, null, `\t`))
        return products
    }
    #generarId = (products) => {
        if (products.length === 0) {
            return 1
        } else {
            const code = products[products.length - 1].id + 1
            return code
        }

    }
}

export default new ProductMemory();