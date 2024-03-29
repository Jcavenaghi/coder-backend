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
      last_connection: {
        type: Date,
        default: Date.now()
      },
      cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
      
});
const userModel = mongoose.model(collection,schema);
export default userModel;