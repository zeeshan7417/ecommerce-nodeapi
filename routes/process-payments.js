const express = require("express");
const router = express.Router();
 const {payments, sendapikey} = require('../controllers/process-payments');
const{protect, authorize}= require('../middleware/authentication');

router.route("/process/payment").post(protect,  payments);
router.route('/sendapikey').get(protect, sendapikey)



module.exports = router;