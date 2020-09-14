const express = require('express');
const articleRoutes = express.Router();
const Article = require('../../models/Article');

articleRoutes.route('/').get(function (req, res) {
  Article.find(function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.json(articles);
    }
  });
});

articleRoutes.get('/:id', (req, res) => {
  Article.findById(req.params.id)
    .then((article) => res.json(article))
    .catch((err) =>
      res.status(404).json({noarticlefound: 'No Article found with that ID'})
    );
});

articleRoutes.post('/', (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    snippet: req.body.snippet,
    description: req.body.description,
    url: req.body.url,
    category: req.body.category,
    references: req.body.references,
    wirrScore: req.body.wirrScore,
    wordCount: req.body.wordCount,
    lastUpdated: req.body.lastUpdated,
  });

  newArticle
    .save()
    .then((article) => res.json(article))
    .catch((err) => res.json(err));
});

module.exports = articleRoutes;
