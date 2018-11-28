var express = require('express');
var router = express.Router();

var Article = require('../models/article_model')

router.get('/', function(req, res, next) {
    Article.find((err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
    });
});

router.get('/tutoriels', function(req, res, next) {
    Article.find({type: "Tutoriel"}, (err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
    });
});

router.get('/developpement-jv', function(req, res, next) {
    Article.find({type: "Developpement JV"}, (err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
    });
});

router.get('/analyse-jv', function(req, res, next) {
    Article.find({type: "Analyse JV"}, (err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
    });
});

router.get('/mes-creations', function(req, res, next) {
    Article.find({type: "Mes Creations"}, (err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
    });
});


module.exports = router;