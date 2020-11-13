const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    level: Number
});
const Group = mongoose.model('Groups',groupSchema);
module.exports = Group;