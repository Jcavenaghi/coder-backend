import productModel from "../dao/models/products.js";
import messageModel from "../dao/models/messages.js";

import express  from "express";
const router = express.Router();

// import ProductManager from "../manager/ProductManager.js";
// const manager = new ProductManager("src/data/products.json");


router.get("/", async (req, res) => {
   const products = await  productModel.find().lean();
    let testUser = {
     name: "Alejandra",
     products
    }
    res.render('index', testUser);
 })



 router.get("/realtimeproducts",  async (req, res) => {
   const products = await  productModel.find().lean();
    let testUser = {
      name: "Alejandra",
      products
    } 
    res.render('realTimeProducts', testUser);
 })


 router.get("/chat", async (req, res) => {
   const messages = await  messageModel.find().lean();
    let testUser = {
     name: "Alejandra",
     messages
    }
    res.render('chat', testUser);
 })
 
 export default router;


