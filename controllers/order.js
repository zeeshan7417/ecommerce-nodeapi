const ordermodel = require('../model/order');


const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const Product = require('../model/product')
// Create new Order
exports.newOrder = asyncHandler(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
 

    const order = await ordermodel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

  
    res.status(201).json({
      success: true,
      order,
    });
  });

  exports.SingleUserOrder = asyncHandler(async(req,res,next)=>{
       const userorder = await ordermodel.findById(req.params.id).populate('user', 'name email');
        if(!userorder)
        return next(
            new ErrorResponse(`No oder found of this ID ${req.query.id}`, 404)
          );  

           res.status(200).json({success:true, order:userorder})
  })

  //Get user of all order details/
  exports.myorder = asyncHandler(async(req,res,next)=>{
    console.log();
  const orders = await ordermodel.find({user:req.user._id.toString()}).exec();
   if(!orders){
    return next(
      new ErrorResponse(`No Data Found Of user ID ${req.user._id.toString()}`, 404)
    );  
   }

    res.status(200).json({success:true,orders })
  })

  //Get Admin Can see All order details/

  exports.getallorderadmin = asyncHandler(async(req,res,next)=>{
   
  const adminorder = await ordermodel.find().exec();
   if(!adminorder){
    return next(
      new ErrorResponse(`No Data Found Of`, 404)
    );  
   }

   let totoalammout =0;

   adminorder.forEach((a)=>{
    totoalammout += a.totalPrice
   })




   res.status(200).json({success:true, totoalammout, adminorder })
  })

  //update order by admin 
  exports.updateOrder = asyncHandler(async(req,res,next)=>{
    const order = await ordermodel.findById(req.params.id);
     if(!order){
      return next(
        new ErrorResponse(`No Data Found Of`, 404)
      );  
     }
if(order.orderStatus=='Delivered')
    {
      return next(
        new ErrorResponse(`Product Already Delivered`, 404)
      );   
    }
    order.orderItems.forEach(async(od)=>{
      await update(od.product, od.quantity)
    })

    order.orderStatus = req.body.status;
         if(req.body.status=='Delivered'){
          order.deliveredAt = Date.now();
         }

          await order.save({ validateBeforeSave: false });

           res.status(200).json({success:true})
  })



  exports.deleteorder = asyncHandler(async(req,res,next)=>{
     const product = await ordermodel.findById(req.params.id);
      if(!product){
        return next(
          new ErrorResponse(`Not found order `, 404)
        );
      }

       await product.remove();

        res.status(200).json({success:true, message:'order delted'});
  })

    async function update(id,qty){
       const product = await Product.findById(id);
      
        product.stock -=qty;
         console.log(product.stock)
        await product.save({ validateBeforeSave: false });
    }