const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

const stripe = require('stripe')(process.env.STRIP_Secret_key);
 

exports.payments =   asyncHandler(async(req,res,next)=>{

     console.log(req.body)
 const mypay =  await stripe.paymentIntents.create({
     amount: req.body.amount,
     currency: 'inr',
     description: 'One-time setup fee',
 })

 res.status(200).json({success:true, client_secret: mypay.client_secret})
     

})

 exports.sendapikey = asyncHandler(async(req,res,next)=>{
      res.status(200).json({STRIP_KEY: process.env.STRIP_KEY})
 })