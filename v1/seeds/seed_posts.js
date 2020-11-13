const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Post = require('../models/posts');
Post.insertMany([
    {
        username: "someguyOTL",
        comment: "I like cake."
    },
    {
        username: "someguy42",
        comment: "I like waffles."
    },
    {
        username: "someguy426",
        comment: "I like pancakes."
    },
    {
        username: "someguy711",
        comment: "I like wax."
    }
])