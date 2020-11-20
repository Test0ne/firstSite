const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Product = require('../models/products');
Product.insertMany([
    {
        seller: "5fb7996d3a5ccd48c897a79d",
        name: "Example cake 1",
        image: "/img/cake.png",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut labore autem et vel aliquid quae corporis eaque alias inventore eum, sunt tempore? Ratione labore, voluptatum laborum sint aliquam aut reprehenderit?",
        rating: 5,
        ratings: 1,
        stock: 1000,
        price: 99.99
    },
    {
        seller: "5fb7996d3a5ccd48c897a79d",
        name: "Example cake 2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut labore autem et vel aliquid quae corporis eaque alias inventore eum, sunt tempore? Ratione labore, voluptatum laborum sint aliquam aut reprehenderit?",
        image: "/img/gold.png",
        rating: 4,
        ratings: 2,
        stock: 1000,
        price: 199.99
    },
    {
        seller: "5fb7996d3a5ccd48c897a79d",
        name: "Example cake 3",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut labore autem et vel aliquid quae corporis eaque alias inventore eum, sunt tempore? Ratione labore, voluptatum laborum sint aliquam aut reprehenderit?",
        image: "/img/p1.png",
        rating: 2,
        ratings: 3,
        stock: 1000,
        price: 299.99
    },
    {
        seller: "5fb7996d3a5ccd48c897a79d",
        name: "Not cake",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut labore autem et vel aliquid quae corporis eaque alias inventore eum, sunt tempore? Ratione labore, voluptatum laborum sint aliquam aut reprehenderit?",
        image: "/img/purp.png",
        rating: 3,
        ratings: 5,
        stock: 1000,
        price: 399.99
    },
    {
        seller: "5fb7996d3a5ccd48c897a79d",
        name: "The answer to life",
        image: "/img/server.png",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut labore autem et vel aliquid quae corporis eaque alias inventore eum, sunt tempore? Ratione labore, voluptatum laborum sint aliquam aut reprehenderit?",
        rating: 4,
        ratings: 2,
        stock: 1000,
        price: 421.69
    }
])