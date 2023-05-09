import { Router } from "express";
// import CartManager from "../manager/CartManager.js";

import cartModel from "../dao/models/carts.js";
import ManagerAccess from "../dao/managers/ManagerAccess.js";
const router = Router();


const managerAccess = new ManagerAccess();
// const manager = new CartManager("src/data/carts.json")


router.get("/:cid", async (req, res) => {
    const id = req.params.cid;
    await managerAccess.crearRegistro(`Consulta carrito ${id}`);
    const result = await cartModel.find({_id:id})
    res.send({result})
    
    // let id = req.params.cid;
    // try {
    //     let products = await manager.getProductsByCartId(parseInt(id));
    //     res.send(products)
    // } catch(error) {
    //     res.status(400).send({status:"error", error: `${error}`} )
    // }
})
router.post("/", async (req, res) => {
    await managerAccess.crearRegistro('agregar carrito');
    const products = []
    const items = { products }
    const result = await cartModel.create(items)
    res.send(result);
    // try {
    //     let cart = await manager.addCart();
    //     res.send(cart)
    // } catch (error) {
    //     res.status(400).send({status:"error", error: `${error}`})
    // }
})
router.put("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    await managerAccess.crearRegistro(`agregar producto: ${pid} al carrito: ${cid}`);
    
    
    const result = await cartModel.findOneAndUpdate(
        { _id: cid, 'items.product': pid }, // Busca un carrito que contenga el producto especificado
        { $inc: { 'items.$.quantity': 1 } }, // Incrementa la cantidad del producto en 1
        { new: true } // Retorna el documento actualizado
        )
        .then(cart => {
            if (cart) {
            // El carrito no contiene el producto, por lo que lo agregamos
            } else {
                const cart = cartModel.findOneAndUpdate(
                    { _id: cid },
                    { $push: { items: { product: pid } } },
                    { new: true }
                );
                console.log(cart);
                res.send(cart);
            // El producto ya existe en el carrito y su cantidad ha sido incrementada
            }
        })
        .catch(err => {
            // Error al buscar y actualizar el carrito
        });
        res.send(result);
    // try {
    //     let resp = await manager.addProductInCartByCartId(parseInt(cid), parseInt(pid));
    //     res.send(resp)
    // } catch(error) {
    //     res.status(400).send({status:"error", error: `${error}`});
    // }
})

export default router;