import { Router } from "express";
import productModel from "../../dao/models/products.js";

import ManagerAccess from "../../dao/managers/ManagerAccess.js";
import ProductManager from "../../dao/managers/ProductManager.js";
const managerAccess = new ManagerAccess();
const productManager = new ProductManager();

const router = Router();


router.get("/:limit?/:page?/:sort?/:query?", async (req, res) => {
    const { limit: limitStr = '10', page = 1, sort = '', query = '' }  = req.params;
    const limit = parseInt(limitStr);
    await managerAccess.crearRegistro('GET');
    try {
        const result = await productManager.getProducts(sort, limit, page, query);
        const products = result.payload;
        const linkQuerys = `?limit=${limit}&sort=${sort}&query=${query}`
        return res.json( {
          products,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          nextPage: result.nextPage,
          prevPage: result.prevPage,
          page: result.page,
          query: linkQuerys
        });
    } catch(error) {
        res.status(400).send({status:"error", error: `error al consultar`})
    }
});

router.get("/:pid", async (req, res) => {
    await managerAccess.crearRegistro('Consulta un solo usuario');
    const id = req.params.pid;
    const result = await productModel.find({_id:id})
    res.send({result})
})

router.post('/', async (req, res) => {
    await managerAccess.crearRegistro('POST');
    const {title, description, code, price, stock, category} = req.body;
    if (!title || !description || !code || !price || !stock | !category ) {
        return res.status(400).send ({
            msg: 'No se registro el usuario',
            error: 'Datos incompletos'
        })
    }

    const product = {title, description, code, price, stock, category}

    const result = await productModel.create(product)
    res.send(result);
})

router.put("/:pid", async (req, res) => {
    await managerAccess.crearRegistro('Actualiza un usuario');

    const id = req.params.pid;
    const data = req.body;

    const result = await productModel.updateOne({_id:id},{$set:data})

    res.send({result});
})

router.delete("/:pid", async (req, res) => {
    await managerAccess.crearRegistro('Elimina un usuario');

    const id = req.params.pid;
    const result = await productModel.deleteOne({_id:id})
    res.send({result})
})

export default router;