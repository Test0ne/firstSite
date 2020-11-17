const express = require('express')
const router = express.Router()

//Schema validations
const Joi = require('joi')
const { uSchema } = require('../models/schemavs')

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('../utils/utils')
const bcrypt = require('bcrypt');

//Models
const { User,Group } = require('../models/users');


//====USER MANAGEMENT START
    router.get('/register', async (req, res) => {
        res.render('register', {title:"Sign up"});
    });
    router.post('/register', wrapAsync(async (req, res) => {
        const vUser = uSchema.validate(req.body);
        let rdat = req.body.register;
        if (vUser.error) {
            req.flash('data',req.body.register)
            req.flash('failure','Failed to create account!');
            res.redirect('/register')
        } else {
            if (await User.findOne({$or:[{username: rdat.username},{email: rdat.username}]})) {
                req.flash('data',rdat);
                req.flash('failure','Username is taken!');
                res.redirect('/register')
            } else if (await User.findOne({$or:[{username: rdat.email},{email: rdat.email}]})) {
                req.flash('data',rdat);
                req.flash('failure','Email address is taken!');
                res.redirect('/register')
            } else {
                const grp = await Group.find({name: "Member"})
                rdat.password = await bcrypt.hash(rdat.password,12);
                rdat.created = Date.now();
                rdat.groups = ["Member"];
                
                const user = new User(rdat);
                await user.save();
                
                req.session.userId = user._id;
                req.flash('success','Account created!');
                res.redirect(`/`)
            };
        };
    }));
    router.get('/login', (req, res) => {
        res.render('login', {title:"Sign in"});
    });
    router.get('/logout', (req, res) => {
        req.session.userId = undefined;req.session.userName = undefined;res.locals.userName = undefined;res.locals.userId = undefined;
        res.redirect('/');
    });
    router.post('/login', wrapAsync(async (req,res) => {
        console.log("/login")
        const {username, password} = req.body.login
        const fUser = await User.findOne({$or:[{username},{email: username}]});
        if (fUser) {
            bcrypt.compare(password, fUser.password, async (e,r)=>{
                if (r) {
                    console.log("compare success!");
                    req.flash('success','Login success!');
                    req.session.userName = fUser.username;
                    req.session.userId = fUser._id;
                    console.log("Logged in!")
                    res.redirect('/')
                } else {
                    console.log("compare fail!")
                    req.flash('failure','Wrong username or password, please try again.')
                    req.flash('data',req.body.login)
                    res.redirect('/login')
                }
            });
        } else {
            req.flash('failure','Wrong username or password, please try again.')
            req.flash('data',req.body.login)
            res.redirect('/login')
        }
    }));
//====USER MANAGEMENT END

module.exports = router;