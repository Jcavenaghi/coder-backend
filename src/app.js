import express from 'express';


import productsRouter from './routes/products.router.js';

import __dirname from './utils.js';


const PORT = 8080;

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.use('/api/products/', productsRouter);
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Home page, nothing to view");
})