import mongoose from 'mongoose';


import moongoosePaginate from 'mongoose-paginate-v2'

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
        index: true
    },
    category:{
        type:String,
        require: true,
        index: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }
})
schema.plugin(moongoosePaginate);
const productModel = mongoose.model(collection,schema);
export default productModel;