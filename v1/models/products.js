const mongoose = require('mongoose');
const Review = require('./reviews');
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
        min: 1,
        max: 5,
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
        ref: 'reviews'
    }]
});
productSchema.post('findOneAndDelete', async function(doc) {
    console.log("FindOneDelete Detected!")
    if (doc) {
        await Review.remove({
            _id: {$in: doc.comments}
        })
    }
})
module.exports = mongoose.model('Products',productSchema);