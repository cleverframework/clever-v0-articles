'use strict';

// Dependencies
let router = require('express').Router();

// Require CleverCore
let CleverCore = require('clever-core');

// Load config
let config = CleverCore.loadConfig();

// Load controller
let pagesApiCtrl = require('../controllers/pages-api');

// Exports
module.exports = function(PagesPackage, app, auth, database) {

  // router.get('/', auth.requiresAdmin, pagesApiCtrl.getPages);

  router.post('/', auth.requiresAdmin, pagesApiCtrl.createPage);

  router.put('/:id', auth.requiresAdmin, pagesApiCtrl.editPage);

  router.delete('/:id', auth.requiresAdmin, pagesApiCtrl.deletePage);

  return new CleverCore.CleverRoute(router, 'api', false);

};
