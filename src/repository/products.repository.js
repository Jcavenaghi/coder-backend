import { CreateProductDto, GetProductDto } from "../dao/dto/products.dto.js";


export class ProductRepository{
    constructor(dao){
        this.dao = dao;
    };

    async getProducts(sort, limit, page, query){
        const products = await this.dao.getProducts(sort, limit, page, query);
        return products;
    };

    async createProduct(product){
        const productDto = new CreateProductDto(product);
        const productCreated = await this.dao.addProduct(productDto);
        return productCreated;
    };

    async getProduct(id){
        const product = await this.dao.getProductById(id);
        const result = new GetProductDto(product);
        return result;
    };

    async updateProduct(id, data){
        const products = await this.dao.updateProduct(id,data);
        return products;
    }

    async deleteProduct(id) {
        const result = await this.dao.deleteProduct(id);
        return result;
    }
}