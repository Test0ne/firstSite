const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Post = require('../models/posts');
Post.insertMany([
    {
        userId: "5fb7996d3a5ccd48c897a78d",
        username: "Brandon",
        comment: "I like modeling."
    },
    {
        userId: "5fb7996d3a5ccd48c897a78d",
        username: "John",
        comment: "I like Network Security."
    },
    {
        userId: "5fb7996d3a5ccd48c897a78d",
        username: "Sean",
        comment: "I like pancakes."
    },
    {
        userId: "5fb7996d3a5ccd48c897a78d",
        username: "Kassie",
        comment: "I like unicorns, bunnies, and pink."
    },
    {
        userId: "5fb7996d3a5ccd48c897a79d",
        username: "Dami",
        comment: "I like Toribash."
    }
])