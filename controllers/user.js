
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const users= require('../model/user');
const crypto = require('crypto');
const sendEmail = require('../utils/Sendmail');
var cloudinary = require('cloudinary');
const Formidable = require('formidable');
 exports.UserCreate= asyncHandler(async(req,res,next)=>{
  const { name, email, password } = req.body;
    if(!name || !email || !password){
        return next(
            new ErrorResponse(`All Field Are required`, 404)
          );
    }
    const files = req.files.avatar.tempFilePath;
    const myCloud = await cloudinary.v2.uploader.upload(files, {
      folder: "shop",
      width: 150,
      crop: "scale",
    });

     const isemailexist = await users.findOne({email});
    if(isemailexist)
    return next(
        new ErrorResponse(`User email exist in our system`, 404)
      );
      const user = await users.create({
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });

      
       sendTokenResponse(user, 200, res);
   
 })

   exports.LoginUser = asyncHandler(async(req,res,next)=>{
       const{email,password}= req.body;
       
        if(!email || !password){
            return next(
                new ErrorResponse(`All Field Are required`, 404)
              );
        }

        const isemailexist = await users.findOne({email}).select("+password")
        if(!isemailexist)
        return next(
            new ErrorResponse(`Invalid credentails`, 404)
          );
        const isMatch = await isemailexist.matchPassword_cmp(password);
          //console.log(users.findSimilarTypes());

          if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
          }

          console.log('ggg',);
sendTokenResponse(isemailexist, 200, res);

           

         


   })


   exports.logout = asyncHandler(async(req,res,next)=>{
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
    
      res.status(200).json({
        success: true,
        message:'user logout'
      });
   })

   exports.getdata = asyncHandler(async(req,res,next)=>{
    const user = await users.findById(req.user.id);
     console.log(req.user)

    res.status(200).json({
      success: true,
     user
    });
   })


   // @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {



    const user = await users.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }
  
    // Get reset token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    // Create reset url
    const resetUrl = `${process.env.FRONT_URL}verifytoken/${resetToken}`;
   
  
    const message = `You are receiving m this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'E commercer Password reset token',
        message
      });
  
      res.status(200).json({ success: true, data: 'Email sent Successfully Please check Email' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  
    res.status(200).json({
      success: true,
      data: user
    });
  });

   exports.verifyTokenPassword = asyncHandler(async(req,res,next)=>{
      
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
    const user = await users.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
    
      if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
      }

       if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorResponse('Passowrd doest not match Confirm password', 400));
       }
        // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);

   
   })
  


   exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await users.findById(req.user.id).select('+password');
  
    // Check current password
    if (!(await user.matchPassword_cmp(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }
     if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorResponse('Password is Not match', 401));
     }
  
    user.password = req.body.newPassword;
    await user.save();
  
    sendTokenResponse(user, 200, res);
  });
  exports.updateprofile = asyncHandler(async(req,res,next)=>{
  
    
    const fieldsToUpdate = { name: req.body.name,email: req.body.email};
      if(req.body.avatar!=''){
      const imagecheck = await users.findById(req.user.id);
      const imageid = imagecheck.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageid);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "shop",
      width: 150,
      crop: "scale",
      });
      fieldsToUpdate.avatar={
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
      }
         

      }




     
      
    
      const user = await users.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
      });
    
      res.status(200).json({
        success: true,
        data: user
      });
  })

  exports.getAllusers = asyncHandler(async(req,res,next)=>{
       const result = await users.find().exec();
        if(!result){
            return next(new ErrorResponse('No Data found', 401));

        }
        res.status(200).json({success:true, user:result})
  })

  exports.getSingleuser = asyncHandler(async(req,res,next)=>{
       const single = await users.findById(req.params.id).exec();
        if(!single){
            return next(new ErrorResponse('Not found', 401));
        }
        res.status(200).json({success:true, user:single})
  })
  

   // Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
    console.log(user)
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
    // res
    //   .status(statusCode)
    //   .cookie('token', token, options)
    //   .json({
    //     success: true,
    //     token
    //   });
  };