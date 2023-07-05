import ProductManager from "../services/managers/ProductManager.js";
import { ProductRepository } from "./products.repository.js";
import { CartRepository } from "./carts.repository.js";
import CartManager from "../services/managers/CartManager.js";

const productManager = new ProductManager();
const cartManager =  new CartManager();
export const productsService = new ProductRepository(productManager);
export const cartService = new CartRepository(cartManager);
