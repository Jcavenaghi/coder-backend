import { Router } from "express";

import cartModel from "../../dao/models/carts.js";
import ManagerAccess from "../../services/managers/ManagerAccess.js";
import CartManager from "../../services/managers/CartManager.js";
import CartsController from "../../controllers/carts.controller.js";


const router = Router();

const cartsController = new CartsController();
const cartManager = new CartManager();
const managerAccess = new ManagerAccess();

/* Hecho */
router.get("/:cid", cartsController.getCartById)

/* Hecho */
router.post("/", cartsController.addCart);


/* Hecho */
router.delete("/:cid/products/:pid", cartsController.deleteProductFromCart);


/* Hecho */
router.delete("/:cid", cartsController.deleteCart)


/* PUT api/carts/:cid deberá actualizar el carrito con un
 arreglo de productos con el formato especificado arriba.*/

 router.put("/:cid", cartsController.addProductsToCart);



router.post("/:cid/products/:pid", cartsController.addOneProductToCart);



/* PUT api/carts/:cid/products/:pid deberá poder 
actualizar SÓLO la cantidad de ejemplares del producto
 por cualquier cantidad pasada desde req.body */

 router.put("/:cid/products/:pid", cartsController.addAnyQuantityProductToCart)


export default router;