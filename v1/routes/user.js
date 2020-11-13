const express = require('express')
const router = express.Router()

//Schema validations
const Joi = require('joi')
const { prSchema, psSchema, commentSchema, reviewSchema } = require('../models/schemavs')

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('../utils/utils')

//Models
const { User,Group } = require('../models/users');
const Review = require('../models/reviews');
const Product = require('../models/products');

//Require sign in
//router.use(authUser)

//====USER MANAGEMENT START
router.get('/register', (req, res) => {
    res.render('register', {title:"Sign up"})
});
router.post('/register', (req, res) => {
    res.render('register', {title:"Sign up"})
});
router.get('/login', (req, res) => {
    res.render('login', {title:"Sign in"})
});
router.post('/login', (req, res) => {
    res.render('login', {title:"Sign in"})
});
router.get('/settings', authUser, (req, res) => {
    res.render('settings', {title:"Sign in"})
});
router.post('/settings', authUser, (req, res) => {
    res.render('settings', {title:"Sign in"})
});
//====USER MANAGEMENT END

module.exports = router;