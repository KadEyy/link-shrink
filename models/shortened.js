const mongoose = require('mongoose');
const shortid = require('shortid');

const Shortened = new mongoose.Schema({
    ip: String,
    shortid: {
        type: String,
        default: shortid.generate
    },
    link: String,
    visitCount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Shortened', Shortened);