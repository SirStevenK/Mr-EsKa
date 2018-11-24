var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs')

var Article = require('../models/article_model')
var articles = []

// 2- Opérations sur les données
var db = mongoose.connection;
db.once('open', function() {
    Article.find((err, Articles) => {
        if (!err) {
            articles = Articles.reverse();
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

router.get('/', function(req, res, next) {
    res.render('index', {articles: articles});
});

router.get('/tutoriels', function(req, res, next) {
  res.render('index', {articles: articles.filter((e) => e.type == "Tutoriel")});
});

router.get('/developpement-jv', function(req, res, next) {
  res.render('index', {articles: articles.filter((e) => e.type == "Developpement JV")});
});

router.get('/analyse-jv', function(req, res, next) {
  res.render('index', {articles: articles.filter((e) => e.type == "Analyse JV")});
});

router.get('/mes-creations', function(req, res, next) {
  res.render('index', {articles: articles.filter((e) => e.type == "Mes Creations")});
});

mongoose.connect('mongodb://localhost/test');

module.exports = router;