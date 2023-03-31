import ProductManager from "./manager/ProductManager.js"
const manager = new ProductManager('./products.json')
const env = async () => {
    let result = await manager.getProducts();
    console.log(result);
    let product = await manager.addProduct({title:"producto prueba", 
        description: "prueba", 
        price:200, 
        thumbnail:"sin img", 
        code:"abc123", 
        stock:25})
    console.log(product);
    let product2 = await manager.addProduct({title:"producto2", 
    description: "prueba2", 
    price:2002, 
    thumbnail:"sin img2", 
    code:"abc1232", 
    stock:251});
    let prods = await manager.getProducts();
    console.log(prods);
    try {
         await manager.addProduct({title:"producto prueba", 
            description: "prueba", 
            price:200, 
            thumbnail:"sin img", 
            code:"abc123", 
            stock:25});
        let prod = await manager.getProductById(1) ;
        console.log(prod);

        let prod1 = await manager.getProductById(2) ;
        console.log(prod1);

        let prod2 = await manager.updateProduct(1, {title: "change"});
        console.log(prod2);
;
        let prods = await manager.deleteProduct(3);
        console.log(prods);
    } catch (error) {
        console.log(error)
    }

}

env()