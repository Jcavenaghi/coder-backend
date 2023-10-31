import ProductManager from "../services/managers/ProductManager.js";
import CartManager from "../services/managers/CartManager.js";
import { checkRole } from "../middlewares/auth.js";
import viewsController from "../controllers/views.controller.js";
import express  from "express";
const router = express.Router();


const ViewsController = new viewsController();
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

router.get("/products", ViewsController.getProducts)


 router.get("/products/:pid", ViewsController.getOneProduct)


 /* vistas del carrito */
router.get("/carts/:cid", checkRole(["USER", "PREMIUM"]), ViewsController.getCartById)

router.get('/register', publicAccess, (req,res)=>{
  res.render('session/register')
})

router.get('/failregister', (req,res) => {
  res.render('session/failRegister')
})


router.get('/', (req,res)=>{
  res.render('session/login')
})

router.get('/login', (req,res)=>{
  res.render('session/login')
})

router.get('/faillogin', (req,res) => {
  res.render('session/failLogin')
})

router.get('/profile', checkRole(["USER", "ADMIN", "PREMIUM"]) ,(req,res)=>{
  console.log(req.user)
  res.render('session/profile',{
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
      edad: req.user.edad,
      cartId: req.user.cart
  })
})
router.get("/forgotPassword",(req,res)=>{
  res.render("session/forgotPassword");
});

router.get('/resetPassword', checkRole(["USER", "ADMIN", "PREMIUM"]), (req,res)=>{
  const token = req.query.token;
  res.render('session/resetPassword', {token});
})

router.get('/adminView', checkRole(["ADMIN"]), ViewsController.getUsers)
 
 export default router;


