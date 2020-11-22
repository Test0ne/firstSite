const express = require('express')
const router = express.Router()

//Utils
const { exError,hError,validateProduct,isSeller,isReviewer,hDebug,authUser,authRole,wrapAsync } = require('../../utils')

//Controller
const products = require('../controllers/products');

//Routes
router.route('/')
    .get(wrapAsync(products.allProducts));
router.route('/new')
    .get(authUser, /**authRole("Admin"), */ wrapAsync(products.createProductForm))
    .put(authUser, /**authRole("Admin"), */ wrapAsync(products.createProduct));

router.route('/:id/edit')
    .get(authUser, isSeller, wrapAsync(products.editProductForm))
    .put(authUser, isSeller, wrapAsync(products.editProduct))
    .delete(authUser, isSeller, wrapAsync(products.deleteProduct));

router.route('/:id')
    .get(wrapAsync(products.showProduct))
    .post(authUser, wrapAsync(products.postReview));

router.route('/:id/:cid')
    .get(authUser, isReviewer, wrapAsync(products.editReviewForm))
    .patch(authUser, isReviewer, wrapAsync(products.editReview))
    .delete(authUser, isReviewer, wrapAsync(products.deleteReview));

module.exports = router;