import fs from 'fs';
export default class ProductManager {
    #privada
    constructor(path) {
        this.path =  path;
    }
    /* Metodos */
    consultarProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    }

    addProduct = async (producto) => {
        const products = await this.consultarProducts();
        if (!products.some (prod => prod.code === producto.code)) {
            let valores = Object.values(producto)
            let camposLlenos = valores.every(valor => !!valor)
            /*el método !!valor se utiliza para convertir el valor en un booleano 
            y asegurarse de que se considere como vacío cualquier valor que sea null
            , undefined, false, 0 o una cadena vacía ''. */
            if ((camposLlenos) && (valores.length >= 6)) {

                let prod = { id: this.#generarId(products), status: true, ...producto}
                products.push(prod)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, `\t`))
                return prod
            } else {
                throw new Error("Faltan completar campos.")
            }
            
        } else {
            throw new Error("Ya existe un producto con ese codigo.")
        }
    }

    getProducts = async () => {
        const products = await this.consultarProducts(); 
        return products
    }


    getProductById = async (id) => {
        const products = await this.consultarProducts();
        if (products.some (prod => prod.id === id)) {
            let i = products.findIndex(prod => prod.id === id)
            return products[i]
        } else {
            throw new Error("Not Found.")
        } 
    }
    /* Recibe un campo de la forma {key: value}, o recibe
        un producto entero. */
    updateProduct = async (id, fields) => {
        const products = await this.consultarProducts();
        if (products.some (prod => prod.id === id)) {
            let i = products.findIndex(prod => prod.id === id)
            if (fields.hasOwnProperty("code")) {
                products[i].code = fields["code"]
            }
            if (fields.hasOwnProperty("description")) {
                products[i].description = fields["description"]
            }
            if (fields.hasOwnProperty("status")) {
                products[i].status = fields["status"]
            }
            if (fields.hasOwnProperty("title")) {
                products[i].title = fields["title"]
            }
            if (fields.hasOwnProperty("price")) {
                products[i].price = fields["price"]
            }
            if (fields.hasOwnProperty("stock")) {
                products[i].stock = fields["stock"]
            }
            if (fields.hasOwnProperty("category")) {
                products[i].category = fields["category"]
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, `\t`))
            return products[i]
        } else {
            throw new Error("Not Found")
        }
    }

    deleteProduct = async (id) => {
        const products = await this.consultarProducts();
        if (products.some (prod => prod.id === id)) {
            let i = products.findIndex(prod => prod.id === id)
            products.splice(i, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, `\t`))
            return products
        } else {
            throw new Error("Not Found")
        } 

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