import productModel from "../dao/models/products.js";
import messageModel from "../dao/models/messages.js";
import ProductManager from "../dao/managers/ProductManager.js";

import CartManager from "../dao/managers/CartManager.js";

import express  from "express";
const router = express.Router();

const manager = new ProductManager();
const managerCart = new CartManager();

router.get("/products", async (req, res) => {
  const { limit: limitStr = '10', page = 1, sort = 'n', query = 'n' }  = req.query;
  const limit = parseInt(limitStr);
  try {
    const result = await manager.getProducts(sort, limit, page, query);
    const products = result.payload;
    const linkQuerys = `limit=${limit}&sort=${sort}&query=${query}`
    res.render('index', {
      products,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
      page: result.page,
      query: linkQuerys
    });

  } catch(error) {
    res.status(400).send({status:"error", error: `error al consultar`})
  }
 })


 router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const result = await manager.getProductById(pid);
    res.render('product', result);
  } catch(error) {
    res.status(400).send({status:"error", error: `error al consultar`})
  }
 })


 /* vistas del carrito */
router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await managerCart.getCart(cid);
    res.render('cart', {
      products: result.items,
      id: cid
    });
  } catch(error) {
    res.status(400).send({status:"error", error: `error al consultar`})
  }
})




//  router.get("/realtimeproducts",  async (req, res) => {
//    const products = await  productModel.find().lean();
//     let testUser = {
//       name: "Alejandra",
//       products
//     } 
//     res.render('realTimeProducts', testUser);
//  })


//  router.get("/chat", async (req, res) => {
//    const messages = await  messageModel.find().lean();
//     let testUser = {
//      name: "Alejandra",
//      messages
//     }
//     res.render('chat', testUser);
//  })
 
 export default router;


