import ManagerAccess from "../dao/managers/ManagerAccess";
import CartManager from "../dao/managers/CartManager";

const cartManager = new CartManager();
const managerAccess = new ManagerAccess();

class cartsController {
    getCartById = async (req, res) => {
        const id = req.params.cid;
        console.log(id);
        await managerAccess.crearRegistro(`Consulta carrito ${id}`);
        try {
            const result = await cartManager.getCart(id);
            res.send({result})    
        } catch (error) {
            res.status(400).send({status:"error", error: `${error}`} )
        };
    }
}

export default CartsController