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
const groupSchema = new Schema({
    name: String,
    level: Number
});

module.exports.Group = mongoose.model('Groups',groupSchema);;
module.exports.User = mongoose.model('Users',userSchema);