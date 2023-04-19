import express  from "express";


const router = express.Router();

import ProductManager from "../manager/ProductManager.js";
const manager = new ProductManager("src/data/products.json");

router.get("/", async (req, res) => {
    let products = await manager.getProducts();
    let testUser = {
     name: "Alejandra",
     products
    }
    res.render('index', testUser);
 })



 router.get("/realtimeproducts",  async (req, res) => {
    let products = await manager.getProducts();
    let testUser = {
      name: "Alejandra",
      products
    } 
    res.render('realTimeProducts', testUser);
 })
 export default router;


