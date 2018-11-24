var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    pseudo: String,
    password: String,
});

module.exports = mongoose.model('users', userSchema);