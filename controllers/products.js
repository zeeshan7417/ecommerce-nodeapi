
 const ErrorResponse = require('../utils/errorResponse');
 const asyncHandler = require('express-async-handler');
const Product = require('../model/product');
const product = require('../model/product');
var cloudinary = require('cloudinary');
var ObjectID = require("mongodb").ObjectID
 exports.CreateProduct = asyncHandler(async(req,res,next)=>{


let filess = req.files.image
let arr  =[]

const budy = {
        name: req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        stock:req.body.stock,
        user_id:req.user.id,
      
  }
  let nietos = [];

  for(const file of filess){

const{tempFilePath} = file;

     const   myCloud = await cloudinary.v2.uploader.upload(tempFilePath, {
    folder: "shop",
    width: 150,
    crop: "scale",
  });

nietos.push({public_id:myCloud.public_id,public_url:myCloud.secure_url})
  }

  budy.image=nietos;

//  a.map(async (item)=>{
  


//    return myCloud;
// //   let my_object = {}; 
// //   my_object.public_id = myCloud.public_id,
// // my_object.url = myCloud.secure_url,




  

//  })





  

 console.log(budy);
//  req.body.user_id = req.user.id;

//  req.body.avatar: {
//   public_id: myCloud.public_id,
//   url: myCloud.secure_url,
// },



 
   const create  = await Product.create(budy);
 
res.status(200).json({success:true, create})
 })
  exports.GetAllProducts = asyncHandler(async(req,res,next)=>{
    
       const query = req.query;
        console.log(query)
      const product = await Product.find({}).exec();
       if(!product)
       return next(
        new ErrorResponse(`Product Not found`, 404)
      );

     
      res.status(200).json(res.advancedResults);
       
  })
   exports.UpdateProduct= asyncHandler(async(req,res,next)=>{
    if(!ObjectID.isValid(req.params.id)){
        return next(
            new ErrorResponse(`Invalid Product Id ${req.params.id}`, 404)
          );
    }
     let product = await Product.findById(req.params.id);
      if(!product)
      return next(
        new ErrorResponse(`Product Not Found of Product Id ${req.params.id}`, 404)
      );
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    
      res.status(200).json({
        success: true,
        data: product
      });
    
   })
    exports.ProductDelete = asyncHandler(async(req,res,next)=>{
        if(!ObjectID.isValid(req.params.id)){
            return next(
                new ErrorResponse(`Invalid Product Id ${req.params.id}`, 404)
              );
        }
         let product = await Product.findById(req.params.id);
         if(!product)
         return next(
            new ErrorResponse(`Product Not found ${req.params.id}`, 404)
          );


        await product.remove();

          res.status(200).json({
            success: true,
            message: "Product has been deleted successfully"
          });
    })
    

    exports.createproductReview = asyncHandler(async(req,res,next)=>{
      const{rating, comment, productId} = req.body;
       const review = {
           user:req.user.id,
           name:req.user.name,
           rating:Number(rating),
           comment,

       }

       let product = await Product.findById(productId);
       let isreviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
       if(isreviewed){
         product.reviews.forEach(element => {
               if(element.user.toString()===req.user._id.toString()){
                element.rating = rating,
                element.comment= comment
               }
         });

       } 
       else{
        product.reviews.push(review); 
        product.numberOfReviews= product.reviews.length; 
       }
       let avg =0;
       product.reviews.forEach(elem=>{
        avg += elem.rating;
    })
       product.averageRating = avg/product.reviews.length;
      
       await product.save({ validateBeforeSave: false });
       res.status(200).json({success:true})
  })

   exports.getallreview = asyncHandler(async(req,res,next)=>{
     console.log(req.query.id);
      const data = await Product.findById(req.query.id);
       if(!data){
        return next(
          new ErrorResponse(`No Review Found Of this Product Id ${req.query.id}`, 404)
        );  
       }
        res.status(200).json({success:true, reviews: data.reviews})
   })

    exports.SingleProduct= asyncHandler(async(req,res,next)=>{
        // if(!ObjectID.isValid(req.params.id)){
        //     return next(
        //         new ErrorResponse(`Invalid Product Id ${req.params.id}`, 404)
        //       );
        // }
         let product = await Product.findById(req.params.id);
         if(!product)
         return next(
            new ErrorResponse(`Product Not found ${req.params.id}`, 404)
          );  
           res.status(200).json({success:true, product}) 
    })  