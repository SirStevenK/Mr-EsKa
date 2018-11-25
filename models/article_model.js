var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = mongoose.Schema({
    title: String,
    description: String,
    type: String,
    url: String,
    image: String,
    content: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('articles', articleSchema);