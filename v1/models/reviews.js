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
        min:1,
        max:5,
        required: true,
        default: 0
    }
});
const Review = mongoose.model('reviews',ReviewSchema);
module.exports = Review;