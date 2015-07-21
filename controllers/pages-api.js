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

  req.assert('title', 'Gallery must have a title of not more than 32 characters').notEmpty().len(1, 32);
  req.assert('slug', 'Gallery must have a slug of not more than 32 characters').notEmpty().len(1, 32);
  req.assert('start', 'Start must be a date').optional().isDate();
  req.assert('end', 'End must be a date').optional().isDate();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  req.body.start = req.body.start ? req.body.start : Date.now();
  // req.body.end = req.body.end ? new Date(req.body.start).getTime() : undefined;

  Page.createPage(req.body)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 201))
    .catch(util.sendObjectAsHttpResponse.bind(null, res, 400));
};
