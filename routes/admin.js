var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ejs = require('ejs')
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../tmp/my-uploads/' });
var fs = require('fs');

var Utilisateur = require('../models/user_model')
var Image = require("../models/image_model");
var Article = require("../models/article_model");
var list_users = []
var list_images = []
var list_articles = []

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

router.get('/postArticle', function(req, res, next) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                res.render('admin/postArticle');
                stop = true;
            }
        });
        if (!stop) {
            res.redirect('/admin');
        }
    }
    else res.redirect('/admin');
});

router.post('/postArticle', function(req, res)
{    
    console.log(req.body)
    const title = req.body.Title;
    const url = req.body.UrlArticle;
    const image = req.body.ImagePrincipale;
    const description = req.body.DescriptionPrincipale;
    const type = req.body.Type;
    const content = req.body.Contenu;

    if(title == "" || content == "" || url == "" || image == "" || description == "" || type == ""){
    //    res.render('admin/postImage', {script: 'alert("Le nom de l\'image est déjà pris");'});
        res.render('admin/postArticle');
    } 
    else 
    {
        let newArticle = new Article({
            title: title,
            description: description,
            type: type,
            url: url,
            image: image,
            content: content,
            date: new Date
        });
        newArticle.save(function(err, user) {
            if (err) return res.json(err);
            res.redirect('/');
        });
    }
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
                res.render('admin/postImage', {script: ""});
                stop = true;
            }
        });
        if (!stop) {
            res.redirect('/admin');
        }
    }
    else res.redirect('/admin');
});

router.post('/postImage', upload.single('image'), function(req, res, next){
    
    const file = req.file;
    const name = req.body.name;
    if(!file){
        // || !list_images.includes(name)
       res.render('admin/postImage', {script: 'alert("Le nom de l\'image est déjà pris");'});
    } 
    else 
    {
        fs.rename(file.path, __dirname + "/../public/images/" + name, function (err) {
            if (err) throw err;
            let newImage = new Image({ name: name, url: '/images/' + name });
            newImage.save(function(err, user) {
                if (err) return res.json(err);
                res.render('admin/postImage', {script: 'alert("L\'image ' + name + ' a bien été créée !");'});
            });
            // res.send('renamed complete');
        });
    }
});

router.get('/manageImage', function(req, res, next) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                Image.find((err, Images) => {
                    if (!err) {
                        // list_images = Images
                        res.render('admin/manageImage', {images: Images});
                    }
                    else {
                        return console.error(err);
                    }
                });
                stop = true;
            }
        });
        if (!stop) {
            res.redirect('/admin');
        }
    }
    else res.redirect('/admin');
});

router.post('/manageImage', function(req, res)
{    
    const url = req.body.url;
    const newUrl = req.body.newUrl;
    const requete = req.body.request;

    if (requete == "Valider") 
    {
        fs.rename(__dirname + "/../public/images/" + url.substring(url.lastIndexOf("/") + 1), __dirname + "/../public/images/" + newUrl.substring(newUrl.lastIndexOf("/") + 1), function (err) {
            if (err) throw err;
            Image.findOneAndUpdate({url : url}, {name: newUrl.substring(newUrl.lastIndexOf("/") + 1), url: newUrl}, () => {res.redirect("/admin/manageImage")});
        });
    }
    else
    {
        fs.unlink(__dirname + "/../public/images/" + url.substring(url.lastIndexOf("/") + 1), (err) => {
            if (err) throw err;
            Image.findOneAndDelete({url : url}, () => {res.redirect("/admin/manageImage")});
        });
    }
});

module.exports = router;