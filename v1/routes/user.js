const express = require('express');
const router = express.Router();
const passport = require('passport');

//Schema validations
const Joi = require('joi');
const { uSchema } = require('../models/schemavs');

//Import utils
const { exError,hError,hDebug,hInfo,authUser,wrapAsync } = require('../utils/utils');
//const bcrypt = require('bcrypt');

//Models
const { User, Group } = require('../models/users');


//====USER MANAGEMENT START
    router.get('/register', async (req, res) => {
        res.render('register', {title:"Sign up"});
    });
    router.post('/register', wrapAsync(async (req, res) => {
        let verErr = uSchema.validate(req.body).error;
        let rdat = req.body.register;
        console.log('rdat')
        console.dir(rdat)
        if (verErr) {
            verErr = verErr.details;
            verErr = (!verErr ? 'Please try again.' : verErr[0].message);
            req.flash('data',rdat);
            req.flash('failure','Failed to create an account!<br/>'+verErr);
            res.redirect('/register');
        } else {
            if (await User.findOne({$or:[{username: rdat.username},{email: rdat.username}]})) {
                req.flash('data',rdat);
                req.flash('failure','Username is taken!');
                res.redirect('/register');
            } else if (await User.findOne({$or:[{username: rdat.email},{email: rdat.email}]})) {
                req.flash('data',rdat);
                req.flash('failure','Email address is taken!');
                res.redirect('/register');
            } else {
                const grp = await Group.findOne({name: "Member"});
                const udata = new User({username: rdat.username,email: rdat.email, date: Date.now()});
                udata.groups.push(grp);
                const ruser = await User.register(udata, rdat.password);
                req.login(ruser, err => {
                    if (err) return next(err);
                    req.flash('success','Account created!');
                    res.redirect(`/`);
                });
            };
        };
    }));
    router.get('/login', (req, res) => {
        if (req.session.returnURL) {delete req.session.returnURL};
        res.render('login', {title:"Sign in"});
    });
    router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), wrapAsync(async (req,res) => {
        req.flash('success','Successfully logged in.');
        const rurl = req.session.returnURL || '/';
        delete req.session.returnURL;
        res.redirect(rurl);
    }));
    router.get('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout();
            req.flash('success','Successfully logged out.');
        };
        res.redirect('/');
    });
//====USER MANAGEMENT END

module.exports = router;