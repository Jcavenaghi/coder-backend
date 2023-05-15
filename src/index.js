import ProductManager from "./manager/ProductManager.js"
const manager = new ProductManager('./products.json')
const env = async () => {
    let result = await manager.getProducts();
  
    let product = await manager.addProduct({title:"producto prueba", 
        description: "prueba", 
        price:200, 
        thumbnail:"sin img", 
        code:"abc123", 
        stock:25})

    let product2 = await manager.addProduct({title:"producto2", 
    description: "prueba2", 
    price:2002, 
    thumbnail:"sin img2", 
    code:"abc1232", 
    stock:251});
    let prods = await manager.getProducts();

    try {
         await manager.addProduct({title:"producto prueba", 
            description: "prueba", 
            price:200, 
            thumbnail:"sin img", 
            code:"abc123", 
            stock:25});
        let prod = await manager.getProductById(1) ;
   

        let prod1 = await manager.getProductById(2) ;
    

        let prod2 = await manager.updateProduct(1, {title: "change"});
   
;
        let prods = await manager.deleteProduct(3);
  
    } catch (error) {
        console.log(error)
    }

}

env()