const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CommentSchema = new Schema({
    //name,comment
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('comments',CommentSchema);