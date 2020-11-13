const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { type } = require('os');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Posts = require('../models/postmodel');
Posts.insertMany([
    {
        username: "someguyOTL",
        comment: "I like cake.",
        comments: []
    },
    {
        username: "someguy42",
        comment: "I like waffles.",
        comments: []
    },
    {
        username: "someguy426",
        comment: "I like pancakes.",
        comments: []
    },
    {
        username: "someguy711",
        comment: "I like wax.",
        comments: [{id: mongoose.Types.ObjectId(), username: "bro",comment:"lol sup"}]
    }
])