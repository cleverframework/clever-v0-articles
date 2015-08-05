'use strict';

// Dependencies
let router = require('express').Router();

// Require CleverCore
let CleverCore = require('clever-core');

// Load config
let config = CleverCore.loadConfig();

// Load controller
let articlesApiCtrl = require('../controllers/articles-api');

// Exports
module.exports = function(ArticlesPackage, app, auth, database) {

  router.get('/', articlesApiCtrl.getArticles);

  router.post('/', auth.requiresAdmin, articlesApiCtrl.createArticle);

  router.put('/:id', auth.requiresAdmin, articlesApiCtrl.editArticle);

  router.delete('/:id', auth.requiresAdmin, articlesApiCtrl.deleteArticle);

  return new CleverCore.CleverRoute(router, 'api', false);

};
