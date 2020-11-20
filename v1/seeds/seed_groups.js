const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/firstSite', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{hDebug("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));

const Group = require('../models/groups');
Group.insertMany([
    {
        name: "Admin",
        level: 100
    },{
        name: "Moderator",
        level: 90
    },{
        name: "Seller",
        level: 10
    },{
        name: "VIP",
        level: 5
    },{
        name: "Member",
        level: 1
    }
])