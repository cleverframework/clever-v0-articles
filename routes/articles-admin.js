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

  router.get('/', auth.requiresAdmin, articlesAdminCtrl.showPages.bind(null, ArticlesPackage));

  router.get('/create', auth.requiresAdmin, articlesAdminCtrl.createPage.bind(null, ArticlesPackage));

  router.get('/:id', auth.requiresAdmin, articlesAdminCtrl.showPage.bind(null, ArticlesPackage));

  router.get('/:id/edit', auth.requiresAdmin, articlesAdminCtrl.editPage.bind(null, ArticlesPackage));

  return new CleverCore.CleverRoute(router, 'admin', false);

};
