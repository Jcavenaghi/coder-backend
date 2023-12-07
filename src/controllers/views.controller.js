import ProductManager from "../services/managers/ProductManager.js";
import CartManager from "../services/managers/CartManager.js";
import UserManager from "../services/managers/UserManager.js";

const managerCart = new CartManager();
const manager = new ProductManager();
const managerUser = new UserManager();
class viewsController {
    getProducts = async (req, res) => {
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
                query: linkQuerys,
                user: req.session.user,
                role: result.role,
                cartId: req.user.cart
            });
    
        } catch(error) {
            res.status(400).send({status:"error", error: `error al consultar`})
        }
    }
    getOneProduct = async (req, res) => {
        const pid = req.params.pid;
        try {
          const result = await manager.getProductById(pid);
          console.log(result.prod);
          res.render('product', {
            prod: result.prod,
            cartId: req.user.cart
          });
        } catch(error) {
          res.status(400).send({status:"error", error: `error al consultar`})
        }
    }
    getCartById = async (req, res) => {
        const cid = req.params.cid;
        try {
          const result = await managerCart.getCart(cid);
          res.render('cart', {
            products: result.items,
            id: cid,
            cartId: req.user.cart
          });
        } catch(error) {
          res.status(400).send({status:"error", error: `error al consultar`})
        }
    }
    getUsers =  async (req, res) => {
        const users = await managerUser.getUsers();
        res.render('adminView', {
            users,
            myUserId: req.user._id
        });
    }
}
export default viewsController