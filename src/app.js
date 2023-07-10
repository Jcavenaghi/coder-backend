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
import { twilioClient, twilioPhone } from './config/twilio_config.js';


// import ProductManager from "./manager/ProductManager.js";


import ProductManager from './services/managers/ProductManager.js';
import MessageManager from './services/managers/MessageManager.js';
import productModel from './dao/models/products.js';

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

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewRouter);
app.use('/api/session', sessionRouter);

// const emailTemplate = `<div>
// <h1>Bienvenido!!</h1>
// <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
// <p>Ya puedes empezar a usar nuestros servicios</p>
// <img width="100%" src="cid:data"/>
// <a href="https://www.google.com/">Explorar</a>
// </div>`;

// app.post("/registro", async (req,res)=>{
//     try {
//         const contenido = await transporter.sendMail({
//             from:"Ecommerce tienda La Nueva",
//             to:"joaquincavenaghi@gmail.com",
//             subject:"Registro exitoso",
//             html: emailTemplate,
//             attachments:[
//                 {
//                     filename: 'data.jpg',
//                     path: path.join(__dirname,"/images/data.jpg"),
//                     cid:"data"
//                 },
//                 {
//                     filename:"factura.pdf",
//                     path: path.join(__dirname,"images/factura.pdf")
//                 }
//             ]
//         })
//         console.log("contenido", contenido);
//         res.json({status:"sucess", message: "Registo y envio de correo."})
//     } catch (error) {
//         console.log(error.message);
//         res.json({status:"error", message: "Hubo un error al registrar al usuario."})
//     }   
// })

// app.post("/compra", async (req, res)=>{
//     try {
        
//         const {nombre, producto} = req.query;

//         //creamos el mensaje
//         const message = await twilioClient.messages.create({
//             body: `Gracias ${nombre}, su producto ${producto} esta en camino.`,
//             from: twilioPhone,
//             to: "+54 2241 470254"
//         })
//         console.log("Message:", message);
//         res.json({status:"success", message:"Compra en camino"})

//     } catch (error) {
//         console.log(error.message);
//         res.json({status:"error", message: "Hubo un error al realizar la compra."})

//     }
// })
