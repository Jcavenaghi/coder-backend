import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();

const manager = new ProductManager("src/data/products.json")

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    try {
        let result = await manager.getProducts();
        if ( limit === 0 || limit >= result.length || isNaN(limit)) {
            res.send(result)
        } else {
            let newArray  =[]
            for (let index = 0; index < limit; index++) {
                newArray.push(result[index])
            }
            res.send(newArray)
        }
    } catch(error) {
        res.status(400).send({status:"error", error: `Error al consultar a la API`})
    }
})

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        let result = await manager.getProductById(parseInt(id))
        res.send(result)
    } catch (error) {
        res.status(400).send({status:"error", error: `Error al consultar a la API`})
    }

})

router.post('/', async (req, res) => {
    const prod = req.body;
    try {
        let add = await manager.addProduct(prod);
        res.status(200).send({status:"ok", add})
    } catch(error) {
        res.status(200).send({status:"error", error: `${error}`});
    }
})

router.put("/:pid", async (req, res) => {
    const prod = req.body;
    let id = req.params.pid;
    try {
        let result = await manager.updateProduct(parseInt(id), prod);
        res.status(200).send({status:"ok", result});
    } catch(error) {
        res.status(400).send({status:"error", error: `${error}`});
    }
})

router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        let prods = await manager.deleteProduct(parseInt(id));
        res.status(200).send({status:"ok", prods});
    } catch(error) {
        res.status(400).send({status:"error", error: `${error}`});
    }
})

export default router;