'use strict';

// Dependencies
let router = require('express').Router();

// Require CleverCore
let CleverCore = require('clever-core');

// Load config
let config = CleverCore.loadConfig();

// Load controller
let pagesAdminCtrl = require('../controllers/pages-admin');

// Exports
module.exports = function(PagesPackage, app, auth, database) {

  router.get('/', auth.requiresAdmin, pagesAdminCtrl.showPages.bind(null, PagesPackage));

  router.get('/create', auth.requiresAdmin, pagesAdminCtrl.createPage.bind(null, PagesPackage));

  router.get('/:id', auth.requiresAdmin, pagesAdminCtrl.showPage.bind(null, PagesPackage));

  router.get('/:id/edit', auth.requiresAdmin, pagesAdminCtrl.editPage.bind(null, PagesPackage));

  return new CleverCore.CleverRoute(router, 'admin', false);

};
