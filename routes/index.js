var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs')

var Article = require('../models/article_model')

// 2- Opérations sur les données
var db = mongoose.connection;

router.get('/', function(req, res, next) {
    Article.find((err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

router.get('/tutoriels', function(req, res, next) {
    Article.find((err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

router.get('/developpement-jv', function(req, res, next) {
    Article.find((err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

router.get('/analyse-jv', function(req, res, next) {
    Article.find((err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

router.get('/mes-creations', function(req, res, next) {
    Article.find((err, Articles) => {
        if (!err) {
            res.render('index', {articles: Articles.reverse()});
        }
        else {
            return console.error(err);
        }
        // mongoose.disconnect();
    });
});

mongoose.connect('mongodb://localhost/test');

module.exports = router;