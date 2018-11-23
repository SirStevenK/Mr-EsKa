var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs')

// 1- Déclaration du modèle
var articleSchema = mongoose.Schema({
    title: String,
    image: String,
    content: String
});
// utilisateurSchema.methods.hello = function() {
//     console.log("Bonjour, je m'appelle " +this.nom + " !");
// };

var Article = mongoose.model('articles', articleSchema);
var articleToPrint = {}

// 2- Opérations sur les données
var db = mongoose.connection;
db.once('open', function() {
    Article.find((err, articles) => {
        if (!err) {
            articleToPrint = articles[0];
        }
        else {
            return console.error(err);
        }
        mongoose.disconnect();
    });
});

/* GET users listing. */
router.get('/[a-zA-Z0-9-]+/', function(req, res, next) {
    console.log(req.url.substring(1));
    res.render('article', { title: articleToPrint.title, image: articleToPrint.image, content: articleToPrint.content });
});

mongoose.connect('mongodb://localhost/test');

module.exports = router;
