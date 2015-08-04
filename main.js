'use strict';

const cleverCore = require('clever-core');
const Package = cleverCore.Package;

// Defining the Package
const Article = new Package('articles');

// All CLEVER packages require registration
Article.register(function(app, auth, database) {

  Article.routes(app, auth, database);

  return Article;

});
