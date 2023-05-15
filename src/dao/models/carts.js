import mongoose from 'mongoose';

const collection = 'Carts';

const schema = new mongoose.Schema({
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
      quantity: { type: Number, default: 1}
    }]
  });

  schema.pre('find', function(){
    this.populate('items.product');
  })
const cartModel = mongoose.model(collection,schema);
export default cartModel;