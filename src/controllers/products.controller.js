
import ManagerAccess from "../services/managers/ManagerAccess.js";
import ProductManager from "../services/managers/ProductManager.js";



import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { productCreateErrorInfo, productGetErrorInfo, productUpdateErrorInfo, productIdErrorInfo, productCreatDuplicateErrorInfo } from "../services/productErrors/productErrorInfo.js";
import { productsService } from "../repository/index.js";
import { generateProduct } from "../utils.js";
import { sendDeleteUserProduct } from "../config/gmail_config.js";
import UserManager from "../services/managers/UserManager.js";


const managerAccess = new ManagerAccess();
const productManager = new ProductManager();
const userManager = new UserManager();

class ProductsController {

    createProduct = async (req, res) => {
        await managerAccess.crearRegistro(`POST - creando producto ${req.body.title}`);
        const {title, description, code, price, stock, category} = req.body;
        if (!title || !description || !code || !price || !stock | !category ) {
            req.logger.warning(`error al crear el producto`);
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

        const product = {title, description, code, price, stock, category, owner: req.user._id}
        try {
            const result = await productsService.createProduct(product);
            req.logger.info(`se creo el producto`)
            res.send({status:"success", result});
        } catch (error) {
            req.logger.info(`error creando el producto`)
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
          req.logger.info(`Se obtuvo el listado de productos`)
          res.send({status:"success", products});
        } catch(error) {
            req.logger.warning(`error al obtener el listado de productos`)
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
            req.logger.info(`Se obtuvo el  producto`)
            res.send({status:"sucess", result});
        } catch (error) {
            req.logger.info(`error al obtener el producto`);
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
            const result = await productsService.updateProduct(id, data)
            req.logger.info(`Se actualizo el producto`)
            res.send({status:"sucess", result});
        } catch (error) {
            req.logger.info(`No se actualizo el producto`)
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
            const prod = await productsService.getProduct(id)
            const user = await userManager.getUserById(prod.owner);
            if (req.user.role === "PREMIUM" ) {
                console.log(prod.owner)
                console.log("---")
                console.log(req.user._id)
                if (req.user._id.toString() != prod.owner ) {
                    req.logger.info(`No se elimino el producto`)
                    CustomError.createError({
                        name: "DELETE product Error",
                        cause: productIdErrorInfo(id),
                        message: "Debe ser el owner para borrar este producto.",
                        errorCode: EError.AUTH_ERROR
                    })
                }
                await sendDeleteUserProduct(user.email)
                const result = await productsService.deleteProduct(id);
                req.logger.info(`Se elimino el producto`)
                res.send({status:"success", result});

            } else if (req.user.role === "ADMIN") {
                await sendDeleteUserProduct(user.email)
                const result = await productsService.deleteProduct(id);
                req.logger.info(`Se elimino el producto`)
                res.send({status:"success", result});
            }
        } catch (error) {
            req.logger.info(`No se elimino el producto`)
            CustomError.createError({
                name: "DELETE product Error",
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
            const prod = generateProduct();
            prods.push(prod);
            productsService.createProduct(prod);
        }
        res.json({prods})
    }
}

export default ProductsController