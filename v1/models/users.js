const colorize = require('colorize');
const cconsole = colorize.console;
const hDebug = (e) => {cconsole.log(`#cyan[${e}]`)};
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    email: String,
    created: Date
});
const User = mongoose.model('Users',userSchema);
function setUser (req,res,next) {
    const userId = req.body.userId;
    if (userId) {
        req.user = users.find(user => user.id === userId)
    }
    next()
}
module.exports = User;