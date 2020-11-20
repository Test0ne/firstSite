const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ReviewSchema = new Schema({
    //name,comment,rating
    username: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        required: true,
        default: 0
    }
});
module.exports = mongoose.model('reviews',ReviewSchema);