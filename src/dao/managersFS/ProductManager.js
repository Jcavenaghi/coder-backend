import fs from 'fs';

import productsDao from '../fileSystemDAO/products.dao.js';
export default class ProductManager {
    #privada
    constructor(path) {
        this.path =  path;
    }
    /* Metodos */
    consultarProducts = async () => {
        if (fs.existsSync(this.path)) {
            productsDao.getAllProducts(this.path)
        } else {
            return [];
        }
    }

    addProduct = async (producto) => {
        const products = await producto.getAllProducts(this,path);
        if (!products.some (prod => prod.code === producto.code)) {
            let valores = Object.values(producto)
            let camposLlenos = valores.every(valor => !!valor)
            /*el método !!valor se utiliza para convertir el valor en un booleano 
            y asegurarse de que se considere como vacío cualquier valor que sea null
            , undefined, false, 0 o una cadena vacía ''. */
            if ((camposLlenos) && (valores.length >= 6)) {
                let prod = await productsDao.addProduct(this.path, producto)
                return prod
            } else {
                throw new Error("Faltan completar campos.")
            }
            
        } else {
            throw new Error("Ya existe un producto con ese codigo.")
        }
    }

    getProducts = async () => {
        const products = await productsDao.getAllProducts(this.path) 
        return products
    }

    getProductById = async (id) => {
        const products = await productsDao.getAllProducts(this.path)
        if (products.some (prod => prod.id === id)) {
            const product = await products.getProductById(this.path, id)
            return product
        } else {
            throw new Error("Not Found.")
        } 
    }
    /* Recibe un campo de la forma {key: value}, o recibe
        un producto entero. */
    updateProduct = async (id, fields) => {
        const products = await productsDao.getAllProducts(this.path)
        if (products.some (prod => prod.id === id)) {
            let i = products.findIndex(prod => prod.id === id)
            const product = productsDao.updateProductById(this.path, i, fields)
            return product
        } else {
            throw new Error("Not Found")
        }
    }

    deleteProduct = async (id) => {
        const products = await productsDao.getAllProducts(this.path);
        if (products.some (prod => prod.id === id)) {
            let i = products.findIndex(prod => prod.id === id)
            let prods = await productsDao.deleteProduct(this.path, i);
            return prods;
        } else {
            throw new Error("Not Found")
        } 

    }
}