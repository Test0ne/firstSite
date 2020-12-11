
//Schema validations
const Joi = require('joi')
const { prSchema, reviewSchema } = require('../models/schemavs')

//Import utils
const { exError,hError,hDebug } = require('../../utils')

//Models
const Review = require('../models/reviews');
const Product = require('../models/products');


module.exports.allProducts = async (req, res) => {
    Product.find().populate('userId').then(products=>res.render('products', { title:"Store", products }));
};
module.exports.createProductForm = async (req, res) => {
    res.render('store/create', {title:"Create new product"})
};
module.exports.createProduct = async (req, res) => {
    let dat = req.body;
    dat.product.seller = req.user._id;
    dat.product.created = Date.now();
    hDebug("Creating product");
    console.dir(dat);
    const vProduct = prSchema.validate(dat);
    if (vProduct.error) {
        req.flash('data',dat.product);
        req.flash('failure',"Error adding product! \n"+vProduct.error);
        res.redirect('/store/new');
    } else {
        const newp = new Product(dat.product);
        await newp.save();
        req.flash('success','Product has been created!');
        res.redirect(`/store/${newp._id}`)
    }
};
module.exports.editProductForm = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('store/edit',{ title:"Store", product });
};
module.exports.editProduct = async (req, res, next) => {
    const { id } = req.params;
    console.dir(req.body)
    await Product.findByIdAndUpdate(id, req.body.product, {runValidators: true});
    req.flash('success','Product has been edited!');
    res.redirect("/store/"+id);
};
module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    req.flash('success',`Product '${product.name}' has been deleted!`);
    res.redirect("/store");
};
module.exports.showProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews').populate('userId');
    if (!product) {
        hError("Error getting product!");
        next(new exError(404,"Product not found!"));
    } else {
        res.render('store/show',{ title:"Store", product });
    };
};
module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    let dat = req.body;
    dat.review.userId = req.user._id;
    dat.review.created = Date.now();

    const vReview = reviewSchema.validate(dat);
    if (vReview.error) {
        hError("Review failed validation! DETAILS:\n"+vReview.error)
        const msg = vReview.error.details.map(el => el.message).join(',')
        
        req.flash('failure','Unable to submit your review! Please try again. ERROR: '+msg);
        req.flash('data',dat.review);
        res.redirect(`/store/${id}`);
    } else {
        const product = await Product.findById(id);
        const review = new Review(dat.review);

        product.reviews.unshift(review);
        await review.save();
        await product.save();
        req.flash('success','Your review has been submitted!');
        res.redirect(`/store/${id}`);
    }
};
module.exports.editReviewForm = async (req, res) => {
    const { id, cid } = req.params;
    const product = await Product.findById(id);
    const review = await Review.findById(cid);
    res.render('store/cedit',{ title:"Edit review", product, review });
};
module.exports.editReview = async (req, res) => {
    const { id, cid } = req.params;
    await Review.findByIdAndUpdate(cid, req.body, {runValidators: true});
    req.flash('success','Review has been edited!');
    res.redirect(`/store/${id}`);
};
module.exports.deleteReview = async (req, res) => {
    const { id, cid } = req.params;
    await Product.findByIdAndUpdate(id,{$pull: {reviews: cid}});
    await Review.findByIdAndDelete(cid);
    req.flash('success','Review has been deleted!');
    res.redirect(`/store/${id}`);
};