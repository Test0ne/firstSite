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
const Comment = mongoose.model('comments',CommentSchema);
module.exports = Comment;