var express = require('express');
var router = express.Router();

var Article = require('../models/article_model')

router.get('/[a-zA-Z0-9-]+\/?/', function(req, res, next) {
    let articleToPrint = -1;
    Article.find((err, Articles) => {
        if (!err) {
            for (let article of Articles)
            {
                if ("articles" + req.url.toLowerCase() == article.url || "articles" + req.url.toLowerCase() == article.url + "/") 
                {
                    articleToPrint = article;
                    break;
                }
            }
            if (articleToPrint != -1) res.render('article', { title: articleToPrint.title, image: articleToPrint.image, content: articleToPrint.content });
            else res.render('error');
        }
        else {
            return console.error(err);
        }
    });
});


module.exports = router;