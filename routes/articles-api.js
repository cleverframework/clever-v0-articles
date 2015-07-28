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

  // router.get('/', auth.requiresAdmin, pagesApiCtrl.getPages);

  router.post('/', auth.requiresAdmin, articlesApiCtrl.createPage);

  router.put('/:id', auth.requiresAdmin, articlesApiCtrl.editPage);

  router.delete('/:id', auth.requiresAdmin, articlesApiCtrl.deletePage);

  return new CleverCore.CleverRoute(router, 'api', false);

};
