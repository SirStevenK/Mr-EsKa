var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs')
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../tmp/my-uploads/' });
var fs = require('fs');

var Utilisateur = require('../models/user_model')
var Image = require("../models/image_model");
var list_users = []
var list_images = []

var db = mongoose.connection;

db.once('open', function() {
    Utilisateur.find((err, Utilisateurs) => {
        if (!err) {
            list_users = Utilisateurs
        }
        else {
            return console.error(err);
        }
    });
});

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function() {
    Image.find((err, Images) => {
        if (!err) {
            list_images = Images
        }
        else {
            return console.error(err);
        }
    });
});

router.get('/', function(req, res, next) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                res.render('admin/menu');
                stop = true;
            }
        });
        if (!stop) {
            console.log("oui")
            res.redirect('/admin');
        }
    }
    else res.render('admin/login');
});

router.post('/', function(req, res){
    if(!req.body.user || !req.body.pwd){
       res.render('admin/login');
    } 
    else 
    {
        let stop = false;
        list_users.forEach((user) => {
            if(user.pseudo === req.body.user && user.password === req.body.pwd && !stop)
            {
                req.session.user = user;
                res.redirect('/admin/menu');
                stop = true;
            }
        });
        if (!stop) res.render('admin/login');
    }
});

router.get('/menu', function(req, res, next) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                res.render('admin/menu');
                stop = true;
            }
        });
        if (!stop) {
            console.log("oui")
            res.redirect('/admin');
        }
    }
    else res.redirect('/admin');
});

router.get('/postImage', function(req, res, next) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                res.render('admin/postImage');
                stop = true;
            }
        });
        if (!stop) {
            console.log("oui")
            res.redirect('/admin');
        }
    }
    else res.redirect('/admin');
});

router.post('/postImage', upload.single('image'), function(req, res, next){
    
    const file = req.file;
    const name = req.body.name;
    if(!file){
       res.render('admin/postImage');
    } 
    else 
    {
        console.log(file);
        console.log(name);
        console.log(list_users);
        console.log(list_images);
        
        fs.rename(file.path, __dirname + "/../public/images/" + name, function (err) {
            if (err) throw err;
            let newImage = new Image({ name: name, url: '/images/' + name });
            newImage.save(function(err, user) {
                if (err) return res.json(err);
                res.send('User ' + user.name + ' successfully created!');
            });
            // res.send('renamed complete');
        });
    }
});

module.exports = router;