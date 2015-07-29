'use strict';

// Module dependencies.
const config = require('clever-core').loadConfig();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const File = mongoose.model('File');
const Gallery = mongoose.model('Gallery');
const async = require('async');
const util = require('../util');

exports.createPage = function(req, res, next) {

  req.assert('title', 'Article must have a title').notEmpty();
  req.assert('slug', 'Article must have a slug').notEmpty();
  req.assert('start', 'Start must be a date').optional().isDate();
  req.assert('end', 'End must be a date').optional().isDate();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  req.body.start = req.body.start ? req.body.start : Date.now();
  // req.body.end = req.body.end ? new Date(req.body.start).getTime() : undefined;

  Article.createPage(req.body)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 201))
    .catch(util.sendObjectAsHttpResponse.bind(null, res, 400));
};

exports.editPage = function(req, res, next) {

  req.assert('title', 'Article must have a title').optional().notEmpty();
  req.assert('slug', 'Article must have a slug').optional().notEmpty();
  req.assert('start', 'Start must be a date').optional().isDate();
  req.assert('end', 'End must be a date').optional().isDate();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  req.body.start = req.body.start ? req.body.start : Date.now();
  // req.body.end = req.body.end ? new Date(req.body.start).getTime() : undefined;

  Article.editPage(req.params.id, req.body)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 202))
    .catch(util.sendObjectAsHttpResponse.bind(null, res, 400));
};

exports.deletePage = function(req, res, next) {
  Article.deletePage(req.params.id)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 202))
    .catch(util.passNext.bind(null, next));
};
