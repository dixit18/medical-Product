const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:['true']
        }
    
   
  },
  {
    timestamps:true
  }
  );

  module.exports = mongoose.model('ProductType', productTypeSchema);