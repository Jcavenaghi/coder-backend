import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique: true,
      },
      first_name: {
        type: String,
        require: true
      },
      last_name: {
        type: String,
        require: true
      },
      age: {
        type: Number,
        require: true
      },
      password:{
        type: String,
        require: true
      },
      role: {
        type: String,
        required:true,
        enum: ["USER","ADMIN"],
        default: 'USER'
      },
      cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
      
});
const cartModel = mongoose.model(collection,schema);
export default cartModel;