import productModel from "../dao/models/products";

const updateProducts = async() => {
    try {
        const adminId = "_ID del admin"
        const result = await productModel.updateMany({}, 
            {$set:{owner:adminId}})
    } catch (error) {
        console.log(error.message);
    }
}
updateProducts();