'use strict';

// Dependencies
let router = require('express').Router();

// Require CleverCore
let CleverCore = require('clever-core');

// Load config
let config = CleverCore.loadConfig();

// Load controller
let articlesAdminCtrl = require('../controllers/articles-admin');

// Exports
module.exports = function(ArticlesPackage, app, auth, database) {

  router.get('/', auth.requiresAdmin, articlesAdminCtrl.showArticles.bind(null, ArticlesPackage));

  router.get('/:id/edit', auth.requiresAdmin, articlesAdminCtrl.editArticle.bind(null, ArticlesPackage));

  return new CleverCore.CleverRoute(router, 'admin', false);

};
