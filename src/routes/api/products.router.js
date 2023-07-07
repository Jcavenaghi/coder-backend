import { Router } from "express";
import ProductsController from "../../controllers/products.controller.js";

import { checkRole } from "../../middlewares/auth.js";
const productsController = new ProductsController();

const router = Router();


router.get("/products", productsController.getProducts);

router.get("/:pid", productsController.getProduct);

router.post('/', checkRole(["ADMIN"]), productsController.createProduct);

router.put("/:pid", checkRole(["ADMIN"]), productsController.updateProduct);

router.delete("/:pid", checkRole(["ADMIN"]), productsController.deleteProduct);

export default router;