import { Router } from "express";
// import ProductManager from "../manager/ProductManager.js";
import productModel from "../dao/models/products.js";

import ManagerAccess from "../dao/managers/ManagerAccess.js";
const managerAccess = new ManagerAccess()

const router = Router();

// const manager = new ProductManager("src/data/products.json")

router.get("/", async (req, res) => {
    await managerAccess.crearRegistro('GET');
    const result = await  productModel.find(); 
    res.send({result});
    // const limit = parseInt(req.query.limit);
    // try {
    //     let result = await manager.getProducts();
    //     if ( limit === 0 || limit >= result.length || isNaN(limit)) {
    //         res.send(result)
    //     } else {
    //         let newArray  =[]
    //         for (let index = 0; index < limit; index++) {
    //             newArray.push(result[index])
    //         }
    //         res.send(newArray)
    //     }
    // } catch(error) {
    //     res.status(400).send({status:"error", error: `Error al consultar a la API`})
    // }
})

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
    // const prod = req.body;
    // try {
    //     let add = await manager.addProduct(prod);
    //     res.status(200).send({status:"ok", add})
    // } catch(error) {
    //     res.status(200).send({status:"error", error: `${error}`});
    // }
})

router.put("/:pid", async (req, res) => {
    await managerAccess.crearRegistro('Actualiza un usuario');

    const id = req.params.pid;
    const data = req.body;

    const result = await productModel.updateOne({_id:id},{$set:data})

    res.send({result});
    // const prod = req.body;
    // let id = req.params.pid;
    // try {
    //     let result = await manager.updateProduct(parseInt(id), prod);
    //     res.status(200).send({status:"ok", result});
    // } catch(error) {
    //     res.status(400).send({status:"error", error: `${error}`});
    // }
})

router.delete("/:pid", async (req, res) => {
    await managerAccess.crearRegistro('Elimina un usuario');

    const id = req.params.pid;
    const result = await productModel.deleteOne({_id:id})
    res.send({result})
    // let id = req.params.pid;
    // try {
    //     let prods = await manager.deleteProduct(parseInt(id));
    //     res.status(200).send({status:"ok", prods});
    // } catch(error) {
    //     res.status(400).send({status:"error", error: `${error}`});
    // }
})

export default router;