import express from 'express';
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import __dirname from './utils.js';


// import ProductManager from "./manager/ProductManager.js";


import ProductManager from './dao/managers/ProductManager.js';
import MessageManager from './dao/managers/MessageManager.js';

// const manager = new ProductManager("src/data/products.json");
const manager = new ProductManager();
const messageManager = new MessageManager();

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
        let products = await manager.deleteProduct(productId)
        // Emitir una señal a todos los clientes conectados para actualizar la lista de productos
        socket.emit('update-products', products);
    });
    socket.on('message', function (data) {
        console.log(data);
    });
    socket.on('add-message', async function(data) {
        let messages = await messageManager.addMessage(data);
        socket.emit('update-messages',messages);
    })
})

/* Configuración de BD mongoose */
const MONGO =  'mongodb+srv://joaquincavenaghi:d6HYWTvSJR6G4yjp@cluster0.ibr5hox.mongodb.net/ecommerce?retryWrites=true&w=majority';
const connection = mongoose.connect(MONGO)

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname+"/views");

app.set('view engine','handlebars');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewRouter);




