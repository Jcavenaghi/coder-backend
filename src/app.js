import express from 'express'

import ProductManager from "./manager/ProductManager.js"
const manager = new ProductManager('./products.json')

const PORT = 8080;

const app = express();

app.use(express.urlencoded({extended:true}));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

app.get("/products", async (req, res) => {
    const limit = parseInt(req.query.limit);
    console.log(typeof(limit))
    let result = await manager.getProducts();
    if ( limit === 0 || limit >= result.length) {
        res.send(result)
    } else {
        let newArray  =[]
        for (let index = 0; index < limit; index++) {
            newArray.push(result[index])
        }
        res.send(newArray)
    }
})


app.get("/", (req, res) => {
    res.send("Home page, nothing to view")
})


app.get("/products/:pid", async (req, res) => {
    let id = req.params.pid;
    let result = await manager.getProductById(parseInt(id))
    res.send(result)
})