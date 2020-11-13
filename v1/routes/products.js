const express = require('express')
const router = express.Router()

//Schema validations
const Joi = require('joi')
const { prSchema, psSchema, commentSchema, reviewSchema } = require('../models/schemavs')

//Import utils
const { exError,hError,hDebug,hInfo,authUser,authRole,wrapAsync } = require('../utils/utils')

//Models
const { User,Group } = require('../models/users');
const Review = require('../models/reviews');
const Product = require('../models/products');

//Require sign in
//router.use(authUser)

//====PRODUCT STORE START
    //ALL PRODUCTS
    router.get('/', wrapAsync(async (req, res) => {
        Product.find().then(products=>res.render('store', { title:"Store", products }));
    }));
    //CREATE PRODUCT PAGE
    router.get('/new', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        res.render('store/create', {title:"Create new product"})
    }));
    //CREATE PRODUCT ACTION
    router.put('/new', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res, next) => {
        const vProduct = prSchema.validate(req.body);
        if (vProduct.error) {
            res.render('store/create', {title:"Create new product",error:"Error adding product! \n"+vProduct.error,data:req.body.product})
        } else {
            const product = new Product(req.body.product);
            await product.save();
            res.redirect(`/${product._id}`)
        }
    }));
    //VIEW PRODUCT
    router.get('/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const product = await Product.findById(id).populate('reviews');
        res.render('store/show',{ title:"Store", product });
    }));
    //EDIT PRODUCT PAGE
    //router.get('/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), async (req, res) => {
    router.get('/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        const { id } = req.params;
        Product.findById(id).then((response)=>{
            res.render('store/edit',{ title:"Store", response });
        });
    }));
    //EDIT PRODUCT ACTION
    //router.put('/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), async (req, res) => {
    router.put('/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
        hDebug("Updated product.")
        res.redirect("/store/"+id);
    }));
    //DELETE PRODUCT
    router.delete('/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect("/store");
    }));
//====PRODUCTS END


//====PRODUCT REVIEWS START
    //POST REVIEW
    router.post('/:id/review', wrapAsync(async (req, res, next) => {
        const { id } = req.params;

        const vReview = reviewSchema.validate(req.body);
        console.log("REQ BODY:")
        console.dir(req.body)
        if (vReview.error) {
            hError("Review failed validation! DETAILS:\n"+vReview.error)
            const msg = vReview.error.details.map(el => el.message).join(',')
            next(new exError(500,"Error posting review! ERROR DETAILS: "+msg))
            //Final version should redirect to form with error msg for better user experience.
            //res.redirect(`/${id}`, {title:"Create new product",error:"Error submitting review! \n"+vReview.error,data:req.body.review});
        } else {
            const product = await Product.findById(id);
            const review = new Review(req.body.review);
            product.reviews.push(review);
            await review.save();
            await product.save();
            res.redirect(`/store/${id}`);
        }
    }));
    //EDIT REVIEW PAGE
    router.get('/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const product = await Product.findById(id);
        const review = await Review.findById(cid);
        
        res.render('store/cedit',{ title:"Edit review", product, review });
    }));
    //EDIT REVIEW ACTION
    router.patch('/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;

        await Review.findByIdAndUpdate(cid, req.body, {runValidators: true});
        hDebug('Review patch success');
        res.redirect(`/store/${id}`);
    }));
    //DELETE REVIEW
    router.delete('/:id/:cid/edit' , wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        await Product.findByIdAndUpdate(id,{$pull: {reviews: cid}});
        await Review.findByIdAndDelete(cid);
        res.redirect(`/store/${id}`);
    }));
//====PRODUCT STORE END

module.exports = router;