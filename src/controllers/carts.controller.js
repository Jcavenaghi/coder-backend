import ManagerAccess from "../services/managers/ManagerAccess.js";
import CartManager from "../services/managers/CartManager.js";
import { cartService } from "../repository/index.js";
const cartManager = new CartManager();
const managerAccess = new ManagerAccess();

class CartsController {
    getCartById = async (req, res) => {
        const id = req.params.cid;
        await managerAccess.crearRegistro(`Consulta carrito ${id}`);
        try {
            const result = await cartService.getCart(id);
            res.send({result})    
        } catch (error) {
            res.status(400).send({status:"error", error: `${error}`} )
        };
    }

    addCart = async (req, res) => {
        await managerAccess.crearRegistro('agregar carrito');
        const products = []
        const items = { products }
        try {
            const result = await cartService.createCart(items)
            return res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", error: `${error}`})
        }
    }
    deleteProductFromCart = async (req,res) => {
        let cid = req.params.cid;
        let pid = req.params.pid;
        await managerAccess.crearRegistro(`borrar producto: ${pid} del carrito: ${cid}`);
        try {
            const result = await cartService.deleteProduct(cid,pid);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", error: `${error}`})
        }
    }

    deleteCart = async (req,res) => {
        let cid = req.params.cid;
        await managerAccess.crearRegistro(`borrar productos del carrito: ${cid}`);
        try {
            const result = await cartService.deleteAllProducts(cid);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", error: `${error}`})
        }
    }

    addProductsToCart = async (req,res) => {
        let cid = req.params.cid;
        const products = req.body.products;
        await managerAccess.crearRegistro(`agregar productos al carrito: ${cid}`);
        try {
            const result = await cartService.addProducts(cid, products);
            res.send(result);
    
        } catch(error) {
            res.status(400).send({status:"error", error: `${error}`}); 
        };
    }

    addOneProductToCart = async (req, res) => {
        let cid = req.params.cid;
        let pid = req.params.pid;
        await managerAccess.crearRegistro(`agregar producto: ${pid} al carrito: ${cid}`);
        
        try {
            const result = await cartService.addOneProduct(cid,pid);
            res.send(result);
        } catch(error) {
            res.status(400).send({status:"error", error: `${error}`}); 
        };
    }

    addAnyQuantityProductToCart = async (req, res) => {
        let cid = req.params.cid;
        let pid = req.params.pid;
        const quantity = req.body.quantity;
        await managerAccess.crearRegistro(`agregar cantidad: ${quantity} al producto: ${pid} del carrito: ${cid}`);
        try {
            const result = await cartService.addQuantityOfProduct(cid,pid,quantity);
            res.send(result);
        } catch (error) {
            res.status(400).send({status:"error", error: `${error}`}); 
        }
                
    }
}

export default CartsController