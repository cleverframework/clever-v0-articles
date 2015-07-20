'use strict';

const cleverCore = require('clever-core');
const Package = cleverCore.Package;

// Defining the Package
const PagesPackage = new Package('pages');

// All CLEVER packages require registration
PagesPackage.register(function(app, auth, database) {

  PagesPackage.routes(app, auth, database);

  return PagesPackage;

});
