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

  router.post('/', auth.requiresAdmin, pagesApiCtrl.createPage);

  return new CleverCore.CleverRoute(router, 'api', false);

};