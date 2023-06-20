import { Router } from "express";
import productModel from "../../dao/models/products.js";

import ManagerAccess from "../../services/managers/ManagerAccess.js";
import ProductManager from "../../services/managers/ProductManager.js";
import ProductsController from "../../controllers/products.controller.js";

const productsController = new ProductsController();
const managerAccess = new ManagerAccess();
const productManager = new ProductManager();

const router = Router();


router.get("/products", productsController.getProducts);

router.get("/:pid", productsController.getProduct);

router.post('/', productsController.createProduct);

router.put("/:pid", productsController.updateProduct);

router.delete("/:pid", productsController.deleteProduct);

export default router;