var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = mongoose.Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('images', imageSchema);