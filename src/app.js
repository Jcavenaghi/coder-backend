import express from 'express';
import handlebars from 'express-handlebars'
import session from 'express-session';

import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import { Server } from 'socket.io';


import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import viewRouter from './routes/views.router.js';
import __dirname from './utils.js';
import sessionRouter from './routes/sessions.router.js'


// import ProductManager from "./manager/ProductManager.js";


import ProductManager from './dao/managers/ProductManager.js';
import MessageManager from './dao/managers/MessageManager.js';
import productModel from './dao/models/products.js';

// const manager = new ProductManager("src/data/products.json");
const manager = new ProductManager();
const messageManager = new MessageManager();

const PORT = 8080;

const app = express();

const httpServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
// const socketServer = new Server(httpServer);

// socketServer.on('connection', async socket=> {
//     socket.on('add-product', async function(data) {
//       let products = await manager.addProduct(data);
//       socket.emit('product-data', { products });
//     });

//         // Escuchar la señal del cliente para eliminar un producto
//     socket.on('delete-product', async function(productId) {
//         let products = await manager.deleteProduct(productId)
//         // Emitir una señal a todos los clientes conectados para actualizar la lista de productos
//         socket.emit('update-products', products);
//     });
//     socket.on('message', function (data) {
//         console.log(data);
//     });
//     socket.on('add-message', async function(data) {
//         let messages = await messageManager.addMessage(data);
//         socket.emit('update-messages',messages);
//     })
// })

/* Configuración de BD mongoose */
const MONGO =  'mongodb+srv://joaquincavenaghi:d6HYWTvSJR6G4yjp@cluster0.ibr5hox.mongodb.net/ecommerce?retryWrites=true&w=majority';
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

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewRouter);
app.use('/api/session', sessionRouter);

// app.get('/', (req,res)=>{
//     req.session.user = 'Active Session';
//     res.send('Session Set');
// });

// app.get('/test', (req,res)=>{
//     res.send(req.session.user);
// })



// const environment = async () => {
//     const perfumes = [
//         {
//           title: 'Azzaro Wanted',
//           description: '100 ml',
//           code: 22,
//           price: 120,
//           status: true,
//           stock: 85,
//           category: 'Amaderado'
//         },
//         {
//           title: 'Carolina Herrera 212 VIP Men',
//           description: '200 ml',
//           code: 36,
//           price: 150,
//           status: true,
//           stock: 70,
//           category: 'Oriental'
//         },
//         {
//           title: 'Jean Paul Gaultier Le Male',
//           description: '125 ml',
//           code: 11,
//           price: 100,
//           status: true,
//           stock: 110,
//           category: 'Fougère'
//         },
//         {
//           title: 'Paco Rabanne Invictus',
//           description: '100 ml',
//           code: 47,
//           price: 90,
//           status: true,
//           stock: 95,
//           category: 'Amaderado Acuático'
//         },
//         {
//           title: 'Versace Eros',
//           description: '100 ml',
//           code: 3,
//           price: 110,
//           status: true,
//           stock: 150,
//           category: 'Oriental'
//         },
//         {
//           title: 'Giorgio Armani Acqua di Gio',
//           description: '100 ml',
//           code: 29,
//           price: 120,
//           status: true,
//           stock: 80,
//           category: 'Acuático'
//         },
//         {
//           title: 'Dior Sauvage',
//           description: '200 ml',
//           code: 41,
//           price: 150,
//           status: true,
//           stock: 60,
//           category: 'Amaderado'
//         },
//         {
//           title: 'Calvin Klein Eternity for Men',
//           description: '100 ml',
//           code: 16,
//           price: 80,
//           status: true,
//           stock: 120,
//           category: 'Fresco'
//         },
//         {
//           title: 'Ralph Lauren Polo Red',
//           description: '125 ml',
//           code: 26,
//           price: 100,
//           status: true,
//           stock: 90,
//           category: 'Amaderado'
//         },
//         {
//           title: 'Hugo Boss Bottled',
//           description: '100 ml',
//           code: 8,
//           price: 85,
//           status: true,
//           stock: 140,
//           category: 'Oriental'
//         },
//         {
//           title: 'Bvlgari Man in Black',
//           description: '100 ml',
//           code: 15,
//           price: 120,
//           status: true,
//           stock: 75,
//           category: 'Oriental Amaderado'
//         },
//         {
//           title: 'Montblanc Legend',
//           description: '100 ml',
//           code: 42,
//           price: 90,
//           status: true,
//           stock: 100,
//           category: 'Fougère'
//         },
//         {
//           title: 'Yves Saint Laurent L\'Homme',
//           description: '100 ml',
//           code: 9,
//           price: 110,
//           status: true,
//           stock: 95,
//           category: 'Fresco'
//         },
        
//     ]
//     productModel.insertMany(perfumes)
//     .then((createdProducts) => {
//       console.log(`Created ${createdProducts.length} products`);
//     })
//     .catch((err) => console.log(err));
// }


// environment();