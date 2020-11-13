const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    email: String,
    created: Date,
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true
    }]
});
const User = mongoose.model('Users',userSchema);
module.exports = User;