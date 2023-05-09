import mongoose from 'mongoose';

const collection = 'Carts';

const schema = new mongoose.Schema({
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1}
    }]
  });

const cartModel = mongoose.model(collection,schema);
export default cartModel;