const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Please Enter Product Name'],
        unique: true,
        trim: true,
       
      },
      slug: String,
      description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description can not be more than 500 characters']
      },
     
      price: {
          type: Number,
          required: [true, 'Please add a Price'],
          maxlength: [8, 'Price can not excced of max length']
        },
     
      averageRating: {
        type: Number,
        default: 0,
      },

     
     
      image: [{
          public_id: {
          type:String,
          require:true
          },
          public_url:{
          type:String,
          required:true, 
          }
      }], 
    
      category: {
        type: String,
        required:[true, 'please enter category'],
        
      },
      stock: {
        type: Number,
        required:[true, 'please enter Stcok'],
        maxlength:[4, "stock can not exceed character"]
      },
      numberOfReviews: {
        type: Number,
        default: 0
      },
  
      reviews: [{


        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
          },
           name:{
              type: String,
              required:true,
           },
            rating:{
                type:Number,
              required:true, 
            },
            comment:{
                type:String,
                required:true,
            }
        
        }],
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
          },
      createdAt: { 
        type: Date,
        default: Date.now
      } 
}  
   
   
)



module.exports = mongoose.model('ProductSchema', ProductSchema);
