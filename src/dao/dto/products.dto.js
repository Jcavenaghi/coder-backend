export class CreateProductDto{
    constructor(product){
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.owner = product.owner;
    }
};

export class GetProductDto{
    constructor(productDB){
        this.title = productDB.prod.title;
        this.description = productDB.prod.description;
        this.code = productDB.prod.code;
        this.price = productDB.prod.price;
        this.stock = productDB.prod.stock;
        this.category = productDB.prod.category;
        this.status = productDB.prod.status;
        this.owner = productDB.prod.owner;
    }
};