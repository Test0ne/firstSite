const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { type } = require('os');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Products = require('../models/storemodel');
Products.insertMany([
    {
        name: "Example cake 1",
        description: "The meaning of life.",
        rating: 10,
        ratings: 1,
        stock: 1000,
        price: 99.99
    },
    {
        name: "Example cake 2",
        description: "Setup your cake, and maybe have it too.",
        rating: 10,
        ratings: 1,
        stock: 1000,
        price: 199.99
    },
    {
        name: "Example cake 3",
        description: "Eat cake, play cake, do cake.",
        rating: 10,
        ratings: 1,
        stock: 1000,
        price: 299.99
    },
    {
        name: "Not cake",
        description: "It looks like cake, it tastes like cake, but it's a person.",
        rating: 10,
        ratings: 1,
        stock: 1000,
        price: 399.99
    },
    {
        name: "The answer to life",
        description: "Cake",
        rating: 10,
        ratings: 1,
        stock: 1000,
        price: 420.69
    }
])