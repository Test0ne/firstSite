const colorize = require('colorize');
const cc = colorize.console;

//Schema validations
const Joi = require('joi')
const { prSchema, reviewSchema } = require('./server/models/schemavs')

//Models
const Review = require('./server/models/reviews');
const Product = require('./server/models/products');

module.exports.hError = hError = (e) => {cc.log(`#red[${e}]`)};
module.exports.hDebug = hDebug = (e) => {cc.log(`#cyan[${e}]`)};
module.exports.hInfo = hInfo = (e) => {cc.log(`#green[${e}]`)};

//===========
//Error middleware
//===========
class exError extends Error {
    constructor(status,message) {
        super();
        this.message = message;
        this.status = status;
    };
};
module.exports.exError = exError;
module.exports.wrapAsync = function (fn) {
    return function(req,res,next) {
        fn(req,res,next).catch((e) => next(e))
    };
};
module.exports.routeCatch = function (err, req, res, next) {
    const { status = 500 } = err;
    const { message = "Something went wrong.<br/>ERROR: "} = err;
    hError("ERROR MSG: "+message);
    hError("ERROR STATUS: "+status);

    res.render('error',{title: status+' error!',status,message});
};
//===========
//Product middleware
//===========
module.exports.validateProduct = function (req,res,next) {
    const { error } = prSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new exError(400,'Product could not be verified: ' +msg))
    } else {
        next();
    }
};
module.exports.validateReview = function (req,res,next) {
    console.dir(req.body)
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new exError(400,'Review could not be verified: ' +msg))
    } else {
        next();
    }
};
module.exports.isSeller = async (req,res,next) => {
    const { id } = req.params;
    let tprod = await Product.findById(id);
    if (!tprod.seller.equals(req.user._id)) {
        req.flash('failure','You do not have permission to modify this product!');
        return res.redirect(`/store/${id}`);
    };
    next();
};
module.exports.isReviewer = async (req,res,next) => {
    const { id, cid } = req.params;
    let trev = await Review.findById(cid);
    if (!trev.userId.equals(req.user._id)) {
        req.flash('failure','You do not have permission to modify this review!');
        return res.redirect(`/store/${id}`);
    };
    next();
};
//===========
//User middleware
//===========
module.exports.setUser = function (req,res,next) {
    //Set user info
    res.locals.currentUser = req.user;
    //Set flash locals
    res.locals.data = req.flash('data');
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure');
    res.locals.shows = req.flash('shows');
    if (!res.locals.failure) {res.locals.failure = req.flash('error')};
    next();
};
module.exports.authUser = function (req,res,next) {
    if (!req.isAuthenticated()) {
        req.session.returnURL = req.originalUrl;
        return res.status(403).render(
            'login',
            {
                title:"Login required!",
                message:`Login required.<br/>Please sign in to access ${req.originalUrl}`
            }
        )
    };
    next();
};
module.exports.authRole = function (role) {
    return (req,res,next) => {
        let fgrp;
        for (let group of req.user.groups[0]) {if (group.name == role) {fgrp = true;break}};
        if (!fgrp) {
            return res.status(403).render(
                'error',
                {
                    title:"Access denied",
                    status:"Access denied",
                    message:`You must be a(n) ${role} to access ${req.originalUrl}`
                }
            )
        };
        next();
    };
};