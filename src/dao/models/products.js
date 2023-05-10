import mongoose from 'mongoose';

const collection = 'Products';

const schema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type: String,
        require: true
    },
    code:{
        type:String,
        require: true,
        unique: true
    },
    price:{
        type:Number,
        require: true
    },
    status:{
        type:Boolean,
        default: true
    },
    stock:{
        type:Number,
        require: true,
    },
    category:{
        type:String,
        require: true
    }
})

const productModel = mongoose.model(collection,schema);
export default productModel;