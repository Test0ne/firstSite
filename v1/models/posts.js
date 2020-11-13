const mongoose = require('mongoose');
const Schema = mongoose.Schema

const postSchema = new Schema({
    username: {
        type: String,
        required: [true,"Username not found"]
    },
    comment: {
        type: String,
        required: [true,"Comment is blank"]
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments',
        required: true
    }]
});
const Post = mongoose.model('Posts',postSchema);
module.exports = Post;