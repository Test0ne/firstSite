const mongoose = require('mongoose');
const Comment = require('./comments');
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
        ref: 'comments',
        required: true
    }]
});
postSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {await Comment.deleteMany({_id: {$in: doc.comments}})};
});
module.exports = mongoose.model('Posts',postSchema);