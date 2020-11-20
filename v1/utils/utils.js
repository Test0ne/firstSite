const colorize = require('colorize');
const cc = colorize.console;
module.exports.hError = hError = (e) => {cc.log(`#red[${e}]`)};
module.exports.hDebug = hDebug = (e) => {cc.log(`#cyan[${e}]`)};
module.exports.hInfo = hInfo = (e) => {cc.log(`#green[${e}]`)};

//===========
//Error handlers
//===========
class exError extends Error {
    constructor(status,message) {
        super();
        this.message = message;
        this.status = status;
    }
}
module.exports.exError = exError;
module.exports.wrapAsync = function (fn) {
    return function(req,res,next) {
        fn(req,res,next).catch((e) => next(e))
    }
}
module.exports.routeCatch = function (err, req, res, next) {
    const { status = 500 } = err;
    const { message = "Something went wrong.\nERROR: "} = err;
    hError("ERROR MSG: "+message);
    hError("ERROR STATUS: "+status);
    res.render('error',{title: status+' error!',status,message});
}
//===========
//User utils
//===========
module.exports.setUser = function (req,res,next) {
    //Set user info
    const ui = req.session.userId;
    const un = req.session.userName;
    const ug = req.session.userGroup;
    if (ui) {res.locals.userId = ui};
    if (un) {res.locals.userName = un};
    if (ug) {res.locals.userGroup = ug};

    //Set user page flash
    res.locals.data = req.flash('data');
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure');
    res.locals.shows = req.flash('shows');
    next()
}
module.exports.authUser = function (req,res,next) {
    if (!req.session.userId) {
        return res.status(403).render('login',{title:"You must be signed in for this!", message: `Please sign in to access ${req.path}`})
    }
    next()
}
module.exports.authRole = function (group) {
    return (req,res,next) => {
        if (req.session.userGroup !== group) {
            return (new exError(401,"Access denied. WTF?."))
        };
        next()
    }
}