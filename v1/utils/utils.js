const colorize = require('colorize');
const cconsole = colorize.console;
const hError = (e) => {cconsole.log(`#red[${e}]`)};
const hDebug = (e) => {cconsole.log(`#cyan[${e}]`)};
const hInfo = (e) => {cconsole.log(`#green[${e}]`)};

//Models
const { User,Group } = require('../models/users');

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
function wrapAsync(fn) {
    return function(req,res,next) {
        fn(req,res,next).catch((e) => next(e))
    }
}
//===========
//User utils
//===========
function setUser (req,res,next) {
    const userId = req.session.username;
    if (userId) {
        console.log("setUser for "+userId)
        res.locals.username = req.session.username;
        //res.locals.username = User.findById(userId)
    }
    next()
}
function authUser (req,res,next) {
    if (req.user == null) {
        return res.status(403).render('login',{title:"You must be signed in for this!", message: `Please sign in to access ${req.path}`})
    }
    next()
}
function authRole (group) {
    return (req,res,next) => {
        if (req.user.group !== group) {
            next(new exError(401,"Access denied. WTF?."))
        } else {
            next()
        }
    }
}


module.exports.exError = exError;
module.exports.hError = hError;
module.exports.hDebug = hDebug;
module.exports.hInfo = hInfo;
module.exports.setUser = setUser;
module.exports.authUser = authUser;
module.exports.authRole = authRole;
module.exports.wrapAsync = wrapAsync;