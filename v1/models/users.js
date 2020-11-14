const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    groups: [{
        type: Array,
        ref: 'groups',
        required: true
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

module.exports.Group = mongoose.model('groups',groupSchema);;
module.exports.User = mongoose.model('Users',userSchema);