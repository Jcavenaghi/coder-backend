
/* imports desde node */
import express from 'express';
import handlebars from 'express-handlebars'
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Server } from 'socket.io';
import compression from 'express-compression';

/*imports de archivos propios del proyecto */
import { config } from './config/config.js';
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import viewRouter from './routes/views.router.js';
import userRouter from './routes/api/users.router.js'
import __dirname from './utils.js';
import sessionRouter from './routes/sessions.router.js'
import initializePassport from './config/passport.config.js';
import { addLogger } from "./utils/logger.js"
import ProductManager from './services/managers/ProductManager.js';
import MessageManager from './services/managers/MessageManager.js';
import { errorHandler } from "./middlewares/errorHandler.js"
import { swaggerSpecs } from './config/docConfig.js';
import swaggerUi from 'swagger-ui-express';

const manager = new ProductManager();
const messageManager = new MessageManager();
const PORT = config.server.port || 8080;

const app = express();

const httpServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})


/* Configuración de BD mongoose */
const MONGO = config.mongo.url;
const connection = mongoose.connect(MONGO)



/* configuración de app */
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
app.use('/api/users/', userRouter);
app.use('/', viewRouter);
app.use('/api/session', sessionRouter);
app.use('/api/docs', swaggerUi.serve,swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

export {app}