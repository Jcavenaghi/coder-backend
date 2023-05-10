import fs from 'fs'

import __dirname from '../../utils.js';

import productModel from '../models/products.js';

export default class ProductManager {

    async addProduct(data) {
        const {title, description, code, price, stock, category} = data;
        if (!title || !description || !code || !price || !stock | !category ) {
            return res.status(400).send ({
                msg: 'No se registro el usuario',
                error: 'Datos incompletos'
            })
        }
        const result = await productModel.create(data)
        return result;
    }

    deleteProduct = async (id) => {
        await productModel.deleteOne({_id:id})
        const result = await productModel.find().lean();
        console.log(result);
        return result
    }
}