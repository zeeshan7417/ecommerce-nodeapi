const express = require("express");
const router = express.Router();
const {UserCreate, LoginUser,logout,getAllusers,getSingleuser, getdata, forgotPassword, verifyTokenPassword,updatePassword,updateprofile}= require('../controllers/user');
const {protect, authorize} = require('../middleware/authentication');
const { route } = require("./product");

router.get('/me', protect,  getdata);
router.route('/register').post(UserCreate)
router.route('/login').post(LoginUser);
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.put('/resetpassword/:resettoken', verifyTokenPassword);
router.put('/updatePassword',protect, updatePassword)
router.put('/me/update',protect,  updateprofile)
router.route('/admin/users').get( protect,authorize('admin'),getAllusers)
router.route('/admin/users/:id').get( protect,authorize('admin'),getSingleuser)
// router.route('/me').get(protect,  (req,res)=>{
//     console.log('hii')
// })
module.exports = router;