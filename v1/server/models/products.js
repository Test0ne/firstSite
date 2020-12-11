const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema

const productSchema = new Schema({
    //name,description,rating,ratings,price
    name: {
        type: String,
        required: true
    },
    assetId: {
        type: Number,
        required: true
    },
    userAssetId: {
        type: Number,
        required: true
    },
    cookie: {
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
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});
productSchema.post('findOneAndDelete', async function(doc) {
    console.log("FindOneDelete Detected!")
    if (doc) {
        await Review.deleteMany({
            _id: {$in: doc.comments}
        })
    }
})
module.exports = mongoose.model('Products',productSchema);