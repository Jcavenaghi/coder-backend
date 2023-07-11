
import ManagerAccess from "../services/managers/ManagerAccess.js";
import ProductManager from "../services/managers/ProductManager.js";



import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { productCreateErrorInfo, productGetErrorInfo, productUpdateErrorInfo, productIdErrorInfo, productCreatDuplicateErrorInfo } from "../services/productErrors/productErrorInfo.js";
import { productsService } from "../repository/index.js";
import { generateProduct } from "../utils.js";



const managerAccess = new ManagerAccess();
const productManager = new ProductManager();

class ProductsController {

    createProduct = async (req, res) => {
        await managerAccess.crearRegistro('POST');
        const {title, description, code, price, stock, category} = req.body;
        if (!title || !description || !code || !price || !stock | !category ) {
            CustomError.createError({
                name: "Create Product Error",
                cause: productCreateErrorInfo(req.body),
                message: "Error creando el producto",
                errorCode: EError.INVALID_JSON
            })
            return res.status(400).send ({
                msg: 'No se registro el producto',
                error: 'Datos incompletos'
            })
        }
        const product = {title, description, code, price, stock, category}
        try {
            const result = await productsService.createProduct(product);
            res.send({status:"sucess", result});
        } catch (error) {
            CustomError.createError({
                name: "Create product Error",
                cause: productCreatDuplicateErrorInfo(code),
                message: "Error creando el producto",
                errorCode: EError.DATABASE_ERROR
            })
        }
    }
    getProducts = async (req, res) => {
        const { limit: limitStr = '10', page = 1, sort = 'n', query = 'n' }  = req.query;
        const limit = parseInt(limitStr);
        try {
          const result = await productsService.getProducts(sort, limit, page, query);
          const products = result.payload;
          const linkQuerys = `limit=${limit}&sort=${sort}&query=${query}`
          res.render('index', {
            products,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            page: result.page,
            query: linkQuerys,
            user: req.session.user,
            role: result.role
          });
        } catch(error) {
            CustomError.createError({
                name: "GET product Error",
                cause: productGetErrorInfo(sort, limit, page, query),
                message: "Error obteniendo los productos",
                errorCode: EError.DATABASE_ERROR
            })
          res.status(400).send({status:"error", error: `error al consultar`})
        }
       }
    getProduct = async (req, res) => {
        await managerAccess.crearRegistro('Consulta un solo producto');
        const id = req.params.pid;
        try {
            const result = await productsService.getProduct(id);
            res.send({status:"sucess", result});
        } catch (error) {
            CustomError.createError({
                name: "GET product Error",
                cause: productIdErrorInfo(id),
                message: "Error obteniendo el producto",
                errorCode: EError.DATABASE_ERROR
            })
        }
    }

    updateProduct = async (req, res) => {
        await managerAccess.crearRegistro('Actualiza un producto');
        const id = req.params.pid;
        const data = req.body;
        try {
            const result = productsService.updateProduct(id, data)
            res.send({status:"sucess", result});
        } catch (error) {
            CustomError.createError({
                name: "UPDATE product Error",
                cause: productUpdateErrorInfo(id, data),
                message: "Error obteniendo el producto",
                errorCode: EError.INVALID_JSON
            })
        }

    }

    deleteProduct = async (req, res) => {
        await managerAccess.crearRegistro('Elimina un producto');
        const id = req.params.pid;
        try {
            const result = await productsService.deleteProduct(id);
            res.send({status:"sucess", result});
        } catch (error) {
            CustomError.createError({
                name: "GET product Error",
                cause: productIdErrorInfo(id),
                message: "Error obteniendo el producto",
                errorCode: EError.DATABASE_ERROR
            })
        }
    }

    createProductsWithMocking = async (req,res) => {
        const cant = parseInt(req.query.cant) || 50;
        const prods = []
        for (let i = 0; i < cant; i++) {
            console.log("toyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            const prod = generateProduct();
            console.log(prod);
            prods.push(prod);
            productsService.createProduct(prod);
        }
        res.json({prods})
    }
}

export default ProductsController