
import ManagerAccess from "../services/managers/ManagerAccess.js";
import ProductManager from "../services/managers/ProductManager.js";

import { productsService } from "../repository/index.js";

const managerAccess = new ManagerAccess();
const productManager = new ProductManager();

class ProductsController {

    createProduct = async (req, res) => {
        await managerAccess.crearRegistro('POST');
        const {title, description, code, price, stock, category} = req.body;
        if (!title || !description || !code || !price || !stock | !category ) {
            return res.status(400).send ({
                msg: 'No se registro el producto',
                error: 'Datos incompletos'
            })
        }
        const product = {title, description, code, price, stock, category}
        const result = await productsService.createProduct(product);
        res.send({status:"sucess", result});
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
          res.status(400).send({status:"error", error: `error al consultar`})
        }
       }

    getProduct = async (req, res) => {
        await managerAccess.crearRegistro('Consulta un solo producto');
        const id = req.params.pid;
        const result = await productsService.getProduct(id);
        res.send({status:"sucess", result});
    }

    updateProduct = async (req, res) => {
        await managerAccess.crearRegistro('Actualiza un producto');
        const id = req.params.pid;
        const data = req.body;
        const result = productsService.updateProduct(id, data)
        res.send({status:"sucess", result});
    }

    deleteProduct = async (req, res) => {
        await managerAccess.crearRegistro('Elimina un producto');
        const id = req.params.pid;
        const result = await productsService.deleteProduct(id);
        res.send({status:"sucess", result});
    }
}

export default ProductsController