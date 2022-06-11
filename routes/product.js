const express = require("express");
const router = express.Router();
const {CreateProduct, GetAllProducts,createproductReview, getallreview,  UpdateProduct, ProductDelete,SingleProduct } = require('../controllers/products');
const product = require('../model/product');
const advancedResults = require('../utils/advancedResults');
const{protect, authorize}= require('../middleware/authentication')

router.route("/admin/products/new").post( protect,authorize('admin'), CreateProduct);
router.route("/products").get(advancedResults(product, ), GetAllProducts);
router.route("/admin/products/:id").put(protect,authorize('admin'), UpdateProduct).delete(protect,authorize('admin'), ProductDelete);
router.route('/product/:id').get(SingleProduct)
router.route('/review').put(protect, createproductReview);

router.route('/reviews').get(getallreview)

module.exports = router;