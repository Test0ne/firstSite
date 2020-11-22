const express = require('express')
const router = express.Router()
const axios = require("axios")

//Import utils
const {hDebug,authUser,wrapAsync} = require('../../utils')

//====HOME + ABOUT
    router.get('/', (req, res) => {
        res.render('home',{title:"Home"});
    });
    router.get('/about', (req, res) => {
        res.render('about',{title:"About us"});
    });
//====HOME + ABOUT


//====TV SEARCH API
    router.get('/shows',authUser, (req, res) => {
        hDebug("/shows get");
        res.render('shows',{title:"Shows"});
    }); 
    router.post('/shows',authUser, wrapAsync(async (req, res) => {
        const shows = await axios.get("http://api.tvmaze.com/search/shows?q="+(req.body.search));
        req.flash('success','Search results received!');
        req.flash('shows',shows.data);
        res.redirect('/shows');
    }));
//====TV SEARCH API


//====GAME
    router.get('/game',authUser, (req, res) => {
        res.render('game',{title:"Game"});
    });
//====GAME

module.exports = router;