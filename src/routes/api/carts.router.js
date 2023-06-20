import { Router } from "express";

import cartModel from "../../dao/models/carts.js";
import ManagerAccess from "../../dao/managers/ManagerAccess.js";
import CartManager from "../../dao/managers/CartManager.js";
import CartsController from "../../controllers/carts.controller.js";


const router = Router();

const cartsController = new CartsController();
const cartManager = new CartManager();
const managerAccess = new ManagerAccess();

/* Hecho */
router.get("/:cid", async (req, res) => {
    const id = req.params.cid;
    await managerAccess.crearRegistro(`Consulta carrito ${id}`);
    try {
        const result = await cartManager.getCart(id);
        res.send({result})    
    } catch (error) {
        res.status(400).send({status:"error", error: `${error}`} )
    };
});

/* Hecho */
router.post("/", async (req, res) => {
    await managerAccess.crearRegistro('agregar carrito');
    const products = []
    const items = { products }
    try {
        const result = await cartManager.addCart(items)
        return res.send(result);
    } catch (error) {
        res.status(400).send({status:"error", error: `${error}`})
    }

});


/* Hecho */
router.delete("/:cid/products/:pid", async (req,res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    await managerAccess.crearRegistro(`borrar producto: ${pid} del carrito: ${cid}`);
    try {
        const result = await cartManager.deleteProduct(cid,pid);
        res.send(result);
    } catch (error) {
        res.status(400).send({status:"error", error: `${error}`})
    }

});


/* Hecho */
router.delete("/:cid", async (req,res) => {
    let cid = req.params.cid;
    await managerAccess.crearRegistro(`borrar productos del carrito: ${cid}`);
    try {
        const result = await cartManager.deleteAllProducts(cid);
        res.send(result);
    } catch (error) {
        res.status(400).send({status:"error", error: `${error}`})
    }
})


/* PUT api/carts/:cid deberá actualizar el carrito con un
 arreglo de productos con el formato especificado arriba.*/

 router.put("/:cid", async (req,res) => {
    let cid = req.params.cid;
    const products = req.body.products;
    await managerAccess.crearRegistro(`agregar productos al carrito: ${cid}`);
    try {
        const result = await cartManager.addProducts(cid, products);
        res.send(result);

    } catch(error) {
        res.status(400).send({status:"error", error: `${error}`}); 
    };
});



router.post("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    await managerAccess.crearRegistro(`agregar producto: ${pid} al carrito: ${cid}`);
    
    try {
        const result = await cartManager.addProduct(cid,pid);
        res.send(result);
    } catch(error) {
        res.status(400).send({status:"error", error: `${error}`}); 
    };
})



/* PUT api/carts/:cid/products/:pid deberá poder 
actualizar SÓLO la cantidad de ejemplares del producto
 por cualquier cantidad pasada desde req.body */

 router.put("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid;
    let pid = req.params.pid;
    const quantity = req.body.quantity;
    await managerAccess.crearRegistro(`agregar cantidad: ${quantity} al producto: ${pid} del carrito: ${cid}`);
    try {
        const result = await cartManager.updateCartById(cid,pid,quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({status:"error", error: `${error}`}); 
    }
            
})


export default router;