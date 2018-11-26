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
                res.render("admin/postArticle", {title: "", type: "", description: "", url: "articles/", image: "", content: "", action: "/admin/postArticle"} );
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

    if(title == "" || content == "" || url == "articles/" || image == "" || description == "" || type == ""){
    //    res.render('admin/postImage', {script: 'alert("Le nom de l\'image est déjà pris");'});
        res.render("admin/postArticle", {title: title, type: type, description: description, url: url, image: image, content: content, action: "/admin/postArticle"} );
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
    
    Image.find((err, Images) => {
        if (!err) {
            if(!file || !Images.every((e) => e.name != name)){
                res.render('admin/postImage', {script: 'alert("Le nom de l\'image est déjà pris");'});
             } 
             else 
             {
                 fs.rename(file.path, __dirname + "/../public/images/" + name, function (err) {
                     if (err) return res.send(err);
                     else
                     {
                        let newImage = new Image({ name: name, url: '/images/' + name });
                        newImage.save(function(err, user) {
                            if (err) return res.json(err);
                            res.render('admin/postImage', {script: 'alert("L\'image ' + name + ' a bien été créée !");'});
                        });
                        // res.send('renamed complete');
                     }
                 });
             }
        }
        else {
            return console.error(err);
        }
    });
});

router.get('/manageArticle', function(req, res, next) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                Article.find((err, Articles) => {
                    if (!err) {
                        res.render('admin/manageArticle', {articles: Articles.reverse()});
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

router.post('/manageArticle', function(req, res)
{    
    const id = req.body.id;
    Article.findByIdAndDelete(id, (err) => {
        if (!err) {
            res.redirect('/admin/manageArticle')
        }
        else {
            return console.error(err);
        }
    });
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
                        res.render('admin/manageImage', {images: Images.reverse(), script: ""});
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
        Image.find((err, Images) => {
            if (!err) {
                if (Images.every(e => e.url != newUrl))
                {
                    fs.rename(__dirname + "/../public/images/" + url.substring(url.lastIndexOf("/") + 1), __dirname + "/../public/images/" + newUrl.substring(newUrl.lastIndexOf("/") + 1), function (err) {
                        if (err) return res.send(err);
                        Image.findOneAndUpdate({url : url}, {name: newUrl.substring(newUrl.lastIndexOf("/") + 1), url: newUrl}, () => {
                            Image.find((err, Images) => {
                                if (!err) res.render("admin/manageImage", {images: Images.reverse(), script: 'alert("L\'image a bien été modifié");'});
                                else return console.error(err);
                            });
                        });
                    });
                }
                else res.render("admin/manageImage", {images: Images.reverse(), script: 'alert("Le nom de l\'image est déjà pris");'}); 
            }
            else {
                return console.error(err);
            }
        });
    }
    else
    {
        Image.find((err, Images) => {
            if (!err) {
                fs.unlink(__dirname + "/../public/images/" + url.substring(url.lastIndexOf("/") + 1), (err) => {
                    if (err) return res.send(err);
                    Image.findOneAndDelete({url : url}, () => {res.redirect('/admin/manageImage')});
                });
            }
            else {
                return console.error(err);
            }
        });
    }
});

router.get('/modifArticle', function(req, res) {
    if (req.session.user)
    {
        currentUser = req.session.user;
        let stop = false;
        list_users.forEach((user) => {
            if (user.pseudo === currentUser.pseudo && user.password === currentUser.password && !stop)
            {
                req.session.user = user;
                Article.findById(req.query.id, function (err, article) {
                    if (!err) {
                        res.render("admin/postArticle", {title: article.title, type: article.type, description: article.description, url: article.url, image: article.image, content: article.content, action: "/admin/modifArticle?id=" + req.query.id} );
                    }
                    else return console.log(err);
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

router.post('/modifArticle', function(req, res)
{    
    console.log(req.body)
    const title = req.body.Title;
    const url = req.body.UrlArticle;
    const image = req.body.ImagePrincipale;
    const description = req.body.DescriptionPrincipale;
    const type = req.body.Type;
    const content = req.body.Contenu;

    if(title == "" || content == "" || url == "articles/" || image == "" || description == "" || type == ""){
        res.render("admin/postArticle", {title: title, type: type, description: description, url: url, image: image, content: content, action: "/admin/modifArticle?id=" + req.query.id} );
    } 
    else 
    {
        Article.findByIdAndUpdate(req.query.id, {title: title, description: description, type: type, url: url, image: image, content: content}, function (err, article) {
            if (!err) {
                res.redirect('/');
            }
            else return console.log(err);
        });
    }
});

module.exports = router;