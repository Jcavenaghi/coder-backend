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
      }
    //   role: {
    //     type: String,
    //     default: 'user'
    //   }
});
const cartModel = mongoose.model(collection,schema);
export default cartModel;