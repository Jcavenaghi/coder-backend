import ManagerAccess from "../services/managers/ManagerAccess.js";
import CartManager from "../services/managers/CartManager.js";
import ProductManager from "../services/managers/ProductManager.js";
import { cartService } from "../repository/index.js";
import { transporter } from "../config/gmail_config.js";
import __dirname from "../utils.js";
import path from "path"


import {v4 as uuidv4} from "uuid";
import ticketModel from "../dao/models/ticket.js";
const cartManager = new CartManager();
const managerAccess = new ManagerAccess();
const productManager = new ProductManager();

class CartsController {
    getCartById = async (req, res) => {
        const id = req.params.cid;
        await managerAccess.crearRegistro(`Consulta carrito ${id}`);
        try {
            const result = await cartService.getCart(id);
            req.logger.info(`se obtuvo el carrito ${id}`)
            res.send({status:"success", result});  
        } catch (error) {
            req.logger.warning(`no puedo obtenerse el carrito ${id}`)
            res.status(400).send({status:"error", error: `${error}`} )
        };
    }

    addCart = async (req, res) => {
        await managerAccess.crearRegistro('agregar carrito');
        const products = []
        const items = { products }
        try {
            const result = await cartService.createCart(items)
            req.logger.info(`se agrego el carrito`)
            res.send({status:"sucess", result});
        } catch (error) {
            req.logger.warning(`error al agregar el carrito`)
            res.status(400).send({status:"error", error: `${error}`})
        }
    }
    deleteProductFromCart = async (req,res) => {
        let cid = req.params.cid;
        let pid = req.params.pid;
        console.log("que apso")
        await managerAccess.crearRegistro(`borrar producto: ${pid} del carrito: ${cid}`);
        try {
            console.log("estoy borrando")
            const result = await cartService.deleteProduct(cid,pid);
            req.logger.info(`se borro el producto ${pid} del carrito ${cid}`)
            res.send({status:"success", result});
        } catch (error) {
            console.log("no borre")
            console.log(error)
            req.logger.info(`Error al borrar el producto.`)
            res.status(400).send({status:"error", error: `${error}`})
        }
    }

    deleteCart = async (req,res) => {
        let cid = req.params.cid;
        await managerAccess.crearRegistro(`borrar productos del carrito: ${cid}`);
        try {
            const result = await cartService.deleteAllProducts(cid);
            req.logger.info(`se elimino el carrito ${cid}`)
            res.send({status:"sucess", result});
        } catch (error) {
            req.logger.warning(`error al borrar el carrito ${cid}`)
            res.status(400).send({status:"error", error: `${error}`})
        }
    }

    addProductsToCart = async (req,res) => {
        let cid = req.params.cid;
        const products = req.body.products;
        await managerAccess.crearRegistro(`agregar productos al carrito: ${cid}`);
        try {
            const result = await cartService.addProducts(cid, products);
            req.logger.info(`se añadieron correctamente los productos al carrito ${cid}`)
            res.send({status:"sucess", result});
    
        } catch(error) {
            req.logger.warning(`error al añadir al carrito`)
            res.status(400).send({status:"error", error: `${error}`}); 
        };
    }

    addOneProductToCart = async (req, res) => {
        let cid = req.params.cid;
        let pid = req.params.pid;
        await managerAccess.crearRegistro(`agregar producto: ${pid} al carrito: ${cid}`);
        
        try {
            const result = await cartService.addOneProduct(cid,pid);
            req.logger.info(`se añadio el producto ${pid} al carrito ${cid}`)
            res.send({status:"sucess", result});
        } catch(error) {
            req.logger.warning(`error al añadir`)
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
            req.logger.info(`se añadieron ${quantity} productos de ${pid} al carrito ${cid}`)
            res.send({status:"sucess", result});
        } catch (error) {
            req.logger.warning(`Error al añadir`)
            res.status(400).send({status:"error", error: `${error}`}); 
        }
                
    }
    endBoughtAndGenerateTicket = async (req,res)=>{
        try {
            const cartId = req.params.cid;
            const cart = await cartService.getCart(cartId);
            if(cart){
                if(!cart.items.length){
                    return res.send("Es necesario que agregue productos.")
                }
                const ticketProducts = [];
                const rejectedProducts = [];
                let total = 0;
                for (let i = 0; i < cart.items.length; i++) {
                    const cartProduct = cart.items[i];
                    const productDB = await productManager.getProductById(cartProduct.product._id);
                    //Comparar la cantidad de los productos
                    if(cartProduct.quantity <= productDB.prod.stock){
                        ticketProducts.push({
                            productID: cartProduct.product._id,
                            price: cartProduct.product.price
                        })
                        total += cartProduct.quantity*productDB.prod.price
                        await cartService.deleteProduct(cartId, cartProduct.product._id);
                    } else {
                        rejectedProducts.push({
                            productID: cartProduct.id,
                            price: cartProduct.price
                        })
                    }
                }
                const newTicket = {
                    code: uuidv4(),
                    purchase_datetime: new Date().toLocaleDateString(),
                    amount: total,
                    purchaser: req.user.email,
                }
                
                const ticketCreated = await ticketModel.create(newTicket)
                res.send(ticketCreated)

            }else{
                res.send("El carrito no existe")
            }

        } catch (error) {
            res.send(error.message)
        }
    }
}

export default CartsController