const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { type } = require('os');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{console.log("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));



const Products = require('./models/storemodel');
Products.findById("5fa4e1977a4ead10e4dead37")
    .then((result)=>{
        console.log("Found result!"+result)
        const {id, name, description, price, stock, rating, ratings, comments} = result;
        console.log(comments)
        comments.find(e => {
            const {id,username,comment} = e;
            return id == cid
        });
        console.log

    })
