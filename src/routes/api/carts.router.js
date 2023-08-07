import { Router } from "express";

import CartsController from "../../controllers/carts.controller.js";

import { checkRole } from "../../middlewares/auth.js";

const router = Router();

const cartsController = new CartsController();



router.get("/:cid", cartsController.getCartById)

router.post("/", cartsController.addCart);

router.delete("/:cid/products/:pid", checkRole(["USER"]), cartsController.deleteProductFromCart);

router.delete("/:cid", checkRole(["ADMIN"]), cartsController.deleteCart)


/* PUT api/carts/:cid deberá actualizar el carrito con un
 arreglo de productos con el formato especificado arriba.*/

 router.put("/:cid", checkRole(["USER", "PREMIUM"]), cartsController.addProductsToCart);



router.post("/:cid/products/:pid", checkRole(["USER"]), cartsController.addOneProductToCart);



/* PUT api/carts/:cid/products/:pid deberá poder 
actualizar SÓLO la cantidad de ejemplares del producto
 por cualquier cantidad pasada desde req.body */

 router.put("/:cid/products/:pid", checkRole(["USER"]), cartsController.addAnyQuantityProductToCart)


 router.post("/:cid/purchase", checkRole(["USER"]), cartsController.endBoughtAndGenerateTicket);

export default router;