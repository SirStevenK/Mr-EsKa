var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs')

// utilisateurSchema.methods.hello = function() {
//     console.log("Bonjour, je m'appelle " +this.nom + " !");
// };

var Article = require('../models/article_model')
var articles = []

// 2- Opérations sur les données
var db = mongoose.connection;
db.once('open', function() {
    Article.find((err, Articles) => {
        if (!err) {
            articles = Articles;
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

/* GET users listing. */
router.get('/[a-zA-Z0-9-]+/', function(req, res, next) {
    let articleToPrint = -1;
    for (let article of articles)
    {
        if ("articles" + req.url.toLowerCase() == article.url) {
            articleToPrint = article;
            break;
        }
    }
    if (articleToPrint != -1) res.render('article', { title: articleToPrint.title, image: articleToPrint.image, content: articleToPrint.content });
    else res.render('error');
});

mongoose.connect('mongodb://localhost/test');

module.exports = router;