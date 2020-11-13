const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Post = require('../models/posts');
Post.insertMany([
    {
        username: "Brandon",
        comment: "I like modeling."
    },
    {
        username: "John",
        comment: "I like Network Security."
    },
    {
        username: "Sean",
        comment: "I like pancakes."
    },
    {
        username: "Kassie",
        comment: "I like unicorns, bunnies, and pink."
    },
    {
        username: "Dami",
        comment: "I like Toribash."
    }
])