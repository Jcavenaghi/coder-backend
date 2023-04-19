import express from 'express';
import handlebars from 'express-handlebars'

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import __dirname from './utils.js';

import { Server } from 'socket.io';

import ProductManager from "./manager/ProductManager.js";
const manager = new ProductManager("src/data/products.json");

const PORT = 8080;

const app = express();

const httpServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
const socketServer = new Server(httpServer);

socketServer.on('connection', async socket=> {
    socket.on('add-product', async function(data) {
      let products = await manager.addProduct(data);
      socket.emit('product-data', { products });
    });

        // Escuchar la señal del cliente para eliminar un producto
    socket.on('delete-product', async function(productId) {
        let products = await manager.deleteProduct(parseInt(productId))
        // Emitir una señal a todos los clientes conectados para actualizar la lista de productos
        socket.emit('update-products', products);
    });
    socket.on('message', function (data) {
        console.log(data);
    });
})



app.engine('handlebars', handlebars.engine());

app.set('views', __dirname+"/views");

app.set('view engine','handlebars');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewRouter);


