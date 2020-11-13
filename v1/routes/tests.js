const express = require('express')
const router = express.Router()

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('../utils/utils')

//Require sign in
//router.use(authUser)

//====TESTS START
//session test
router.get('/session', wrapAsync(async (req, res) => {
    if (req.session.testVar)  {req.session.testVar += 1} else {req.session.testVar = 1};
    res.render('error',{title: 'Session test',status:"Session test",message:"Visit "+req.session.testVar});
}));
//session name
router.get('/setname', wrapAsync(async (req, res) => {
    const { username = "Anonymous" } = req.query;
    req.session.username = username;
    req.flash('data',' Successfully set name! ');
    res.redirect('/greets');
}));
//session greet
router.get('/greets', async (req, res) => {
    res.render('error',{title: 'Greet session',status:"Hello"+req.flash('data'),message:req.session.username});
});
//cookie read test
router.get('/greet', async (req, res) => {
    const { name = "default" } = req.signedCookies;
    res.render('error',{title: 'Greet',status:"Hello",message:name});
});
//cookie set test
router.get('/nameset', async (req, res) => {
    res.cookie('name','Swager', { signed: true })
    res.render('error',{title: 'Cookie set',status:"Cookie has been set.",message:"Enjoy!"});
});
//====TESTS END

module.exports = router;