const express = require("express");
const router = express.Router();
 const{newOrder,SingleUserOrder,deleteorder, myorder,updateOrder,  getallorderadmin}= require('../controllers/order');
const{protect, authorize}= require('../middleware/authentication')

router.route("/order/new").post(protect,  newOrder);
router.route('/orders/myorder').get(protect, myorder)
router.route('/orders/:id').get(protect,  SingleUserOrder)
router.route('/admin/orders').get(protect,authorize('admin'),  getallorderadmin)
router
  .route("/admin/order/:id")
  .put(protect, authorize("admin"), updateOrder).delete(protect,authorize('admin'), deleteorder)
  

// router.post('/oreder', (req,res,next)=>{
//     console.log(req.body)
// })



module.exports = router;