import { Router } from "express";
import CartManager from "../manager/CartManager.js";
const router = Router();


const manager = new CartManager("src/data/carts.json")


router.get("/:cid", async (req, res) => {
    let id = req.params.cid;
    try {
        let products = await manager.getProductsByCartId(parseInt(id));
        res.send(products)
    } catch(error) {
        res.status(400).send({status:"error", error: `${error}`} )
    }
})
router.post("/", async (req, res) => {
    try {
        let cart = await manager.addCart();
        res.send(cart)
    } catch (error) {
        res.status(400).send({status:"error", error: `${error}`})
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    try {
        let resp = await manager.addProductInCartByCartId(parseInt(cid), parseInt(pid));
        res.send(resp)
    } catch(error) {
        res.status(400).send({status:"error", error: `${error}`});
    }
})

export default router;