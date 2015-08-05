'use strict';

// Module dependencies.
const config = require('clever-core').loadConfig();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const File = mongoose.model('File');
const Gallery = mongoose.model('Gallery');
const async = require('async');
const util = require('../util');

exports.getArticles = function(req, res, next) {

  let activePage = Number.parseInt(req.query.page);
  activePage = Number.isNaN(activePage) ? 0 : activePage;
  const skip = activePage * 10;
  const search = req.query.search;

  Article.getArticles(skip, 10, search)
    .then(res.json.bind(res))
    .catch(util.passNext.bind(null, next));

}

exports.createArticle = function(req, res, next) {

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

  Article.createArticle(req.body)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 201))
    .catch(util.sendObjectAsHttpResponse.bind(null, res, 400));
};

exports.editArticle = function(req, res, next) {

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

  Article.editArticle(req.params.id, req.body)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 202))
    .catch(util.sendObjectAsHttpResponse.bind(null, res, 400));
};

exports.deleteArticle = function(req, res, next) {
  Article.deleteArticle(req.params.id)
    .then(util.sendObjectAsHttpResponse.bind(null, res, 202))
    .catch(util.passNext.bind(null, next));
};
