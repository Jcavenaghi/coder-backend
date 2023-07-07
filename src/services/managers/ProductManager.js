import fs from 'fs'

import __dirname from '../../utils.js';

import productModel from '../../dao/models/products.js';

export default class ProductManager {

    async addProduct(product) {
        try {
            const prod = await productModel.create(product)
            return { prod }
        } catch (err) {
            throw new Error("error");
        }
    }

    async getProductById(pid) {
        // Buscar un producto por su id
        try {
            const prod = await productModel.findById(pid).lean();
            return { prod }
        } catch (err) {
            throw new Error("error");
        }

    };

    async getProducts(sort, limit, page, query) {
        const orderOptions = {};
        if (sort === 'asc' || sort === 'desc') {
            // Ordena por el campo dado en orden ascendente o descendente
            orderOptions[`${query}`] = sort === 'asc' ? 1 : -1;
        }
        const queryOptions = {};
        if (query != 'n') {
            queryOptions[`${query}`] = { $exists: true};
        }
        const paginateOptions = {
            page: page,
            limit: limit,
            sort: orderOptions,
        };
        const result = await productModel.paginate(queryOptions, { ...paginateOptions, lean: true })
        if (result != []) {
            return {
                status: 'success',
                payload: result.docs,
                totalProducts: result.totalDocs,
                totalPages: result.totalPages,
                page: result.page,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
            };
        } else {
            throw new Error('Pruebe con otros parametros.'); 
        }


    }
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

    updateProduct = async (id, data) => {
        try {
            const products = await productModel.updateOne({_id:id},{$set:data});
            return products
        } catch(err) {
            throw new Error('Error'); 
        }
    }
    
    deleteProduct = async (id) => {
        await productModel.deleteOne({_id:id})
        const result = await productModel.find().lean();
        return result
    }
}