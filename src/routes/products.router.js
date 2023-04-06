import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();

const manager = new ProductManager("./products.json")

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    let result = await manager.getProducts();
    console.log(limit)
    if ( limit === 0 || limit >= result.length || isNaN(limit)) {
        console.log("i'm here, it is ok?")
        res.send(result)
    } else {
        console.log("i'm here, it is ok?2")
        let newArray  =[]
        for (let index = 0; index < limit; index++) {
            newArray.push(result[index])
        }
        res.send(newArray)
    }
})

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    let result = await manager.getProductById(parseInt(id))
    res.send(result)
})

router.post('/', async (req, res) => {
    const prod = req.body
    try {
        let add = await manager.addProduct(prod);
        res.status(200).send({status:"ok"})
    } catch(error) {
        res.status(200).send({status:"error", error: `${error}`})
    }
})

export default router;