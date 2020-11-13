const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ReviewSchema = new Schema({
    //name,comment,rating
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
});
const Review = mongoose.model('Reviews',ReviewSchema);
module.exports = Review;