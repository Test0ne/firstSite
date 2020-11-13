const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productSchema = new Schema({
    //name,description,rating,ratings,price
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    ratings: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Reviews',
        required: true
    }]
});
const Product = mongoose.model('Products',productSchema);
module.exports = Product;