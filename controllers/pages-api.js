'use strict';

// Module dependencies.
const config = require('clever-core').loadConfig();
const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const File = mongoose.model('File');
const Gallery = mongoose.model('Gallery');
const async = require('async');
const util = require('../util');

exports.createPage = function(req, res, next) {
  res.json(req.body);
};
