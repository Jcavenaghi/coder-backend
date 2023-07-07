import mongoose from 'mongoose';

const collection = 'Tickets';

const schema = new mongoose.Schema({
    code:{
        type:String,
        require:true
    },
    purchase_datatime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type:Number,
        require:true
    },
    purchaser: {
        type:String,
        require:true
    }
  });

  schema.pre('find', function(){
    this.populate('items.product');
  })
  const ticketModel = mongoose.model(collection, schema);
export default ticketModel;