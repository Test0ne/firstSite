const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    created: Date,
    groups: [{
        type: Array,
        ref: 'groups'
    }]
});
const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports.Group = mongoose.model('groups',groupSchema);
module.exports.User = mongoose.model('Users',userSchema);