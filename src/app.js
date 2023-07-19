import express from 'express';
import handlebars from 'express-handlebars'
import session from 'express-session';

import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import passport from 'passport';

import { Server } from 'socket.io';

import path from "path"
import { config } from './config/config.js';
import { transporter } from './config/gmail_config.js';
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import viewRouter from './routes/views.router.js';
import __dirname from './utils.js';
import sessionRouter from './routes/sessions.router.js'
import initializePassport from './config/passport.config.js';


import { addLogger } from "./utils/logger.js"
import ProductManager from './services/managers/ProductManager.js';
import MessageManager from './services/managers/MessageManager.js';
import compression from 'express-compression';
import { errorHandler } from "./middlewares/errorHandler.js"

// const manager = new ProductManager("src/data/products.json");
const manager = new ProductManager();
const messageManager = new MessageManager();
const PORT = config.server.port || 8080;

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
const MONGO = config.mongo.url;
const connection = mongoose.connect(MONGO)


app.engine('handlebars', handlebars.engine());

app.set('views', __dirname+"/views");

app.set('view engine','handlebars');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 200
    }),
    secret: "CoderSecret",
    resave:false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(compression({
    brotli:{enable:true, zlib:{}}
}));
app.use(addLogger);
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewRouter);
app.use('/api/session', sessionRouter);
app.use(errorHandler);


app.get("/loggerTest", (req,res)=>{
    req.logger.debug("nivel debug");
    req.logger.http("nivel http");
    req.logger.info("nivel info");
    req.logger.warning("nivel warning");
    req.logger.error("nivel error");
    req.logger.fatal("nivel fatal");
    res.send("prueba niveles")
});
