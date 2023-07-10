import productModel from "../dao/models/products.js";
import messageModel from "../dao/models/messages.js";
import ProductManager from "../services/managers/ProductManager.js";

import CartManager from "../services/managers/CartManager.js";
import { checkRole } from "../middlewares/auth.js";

import express  from "express";
const router = express.Router();

const manager = new ProductManager();
const managerCart = new CartManager();


const publicAccess = (req,res,next) =>{
  if(req.session.user) return res.redirect('/profile');
  next();
}

const privateAccess = (req,res,next)=>{
  if(!req.session.user) return res.redirect('/login');
  next();
}

router.get("/products", async (req, res) => {
  const { limit: limitStr = '10', page = 1, sort = 'n', query = 'n' }  = req.query;
  const limit = parseInt(limitStr);
  try {
    const result = await manager.getProducts(sort, limit, page, query);
    const products = result.payload;
    console.log(req.user.cart);
    const linkQuerys = `limit=${limit}&sort=${sort}&query=${query}`
    res.render('index', {
      products,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
      page: result.page,
      query: linkQuerys,
      user: req.session.user,
      role: result.role,
      cartId: req.user.cart
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
router.get("/carts/:cid", checkRole(["USER"]), async (req, res) => {
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

router.get('/register', publicAccess, (req,res)=>{
  res.render('session/register')
})

router.get('/', publicAccess, (req,res)=>{
  res.render('session/login')
})

router.get('/login', publicAccess, (req,res)=>{
  res.render('session/login')
})

router.get('/profile', checkRole(["USER", "ADMIN"]) ,(req,res)=>{
  res.render('session/profile',{
      user: req.session.user,
      role: req.session.user.role
  })
})

router.get('/resetPassword', checkRole(["USER", "ADMIN"]), (req,res)=>{
  res.render('session/resetPassword');
})

//  router.get("/realtimeproducts",  async (req, res) => {
//    const products = await  productModel.find().lean();
//     let testUser = {
//       name: "Alejandra",
//       products
//     } 
//     res.render('realTimeProducts', testUser);
//  })


 router.get("/chat", checkRole(["USER"]), async (req, res) => {
   const messages = await  messageModel.find().lean();
    let testUser = {
     name: "Alejandra",
     messages
    }
    res.render('chat', testUser);
 })
 
 export default router;


