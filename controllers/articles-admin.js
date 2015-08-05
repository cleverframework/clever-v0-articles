'use strict';

// Module dependencies.
const config = require('clever-core').loadConfig();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const File = mongoose.model('File');
const Gallery = mongoose.model('Gallery');
const async = require('async');
const util = require('../util');

// Show user list
exports.showArticles = function(ArticlesPackage, req, res, next) {

  let activePage = Number.parseInt(req.query.page);
  activePage = Number.isNaN(activePage) ? 0 : activePage;
  const skip = activePage * 10;
  const search = req.query.search;

  function renderArticleList(articles, nArticles) {
    try {
      res.send(ArticlesPackage.render('admin/list', {
        packages: ArticlesPackage.getCleverCore().getInstance().exportablePkgList,
        packageName: ArticlesPackage.name,
        user: req.user,
        articles: articles,
        nArticles: nArticles,
        activePage: activePage,
        csrfToken: req.csrfToken()
      }));
    } catch(e) {
      util.passNext(next, e);
    }
  }

  async.parallel([
    function getArticles(cb){
      Article.getArticles(skip, 10, search)
        .then(cb.bind(null, null))
        .catch(util.passNext.bind(null, cb));
    },
    function countArticles(cb){
      Article.countArticles(search)
        .then(cb.bind(null, null))
        .catch(util.passNext.bind(null, cb));
    }
  ], function(err, options){
      if(err) return util.passNext.bind(null, next);
      renderArticleList.apply(null, options);
  });

};

exports.showArticle = function(ArticlesPackage, req, res, next) {
  function render(imageList, galleryList, articleToShow) {
    res.send(ArticlesPackage.render('admin/details', {
      packages: ArticlesPackage.getCleverCore().getInstance().exportablePkgList,
      articleToShow: articleToShow,
      packageName: ArticlesPackage.name,
      imageList: JSON.stringify(imageList),
      galleryList: JSON.stringify(galleryList),
      user: req.user,
      csrfToken: req.csrfToken()
    }));
  }

  File.getImageList()
    .then(function(imageList) {
      Gallery.getGalleryList()
        .then(function(galleryList) {
          Article.getArticle(req.params.id)
            .then(render.bind(null, imageList, galleryList))
            .catch(util.passNext.bind(null, next));
        })
        .catch(util.passNext.bind(null, next));
    })
    .catch(util.passNext.bind(null, next));
};

exports.editArticle = function(ArticlesPackage, req, res, next) {
  function render(imageList, galleryList, articleToEdit) {
    try {
      res.send(ArticlesPackage.render('admin/edit', {
        packages: ArticlesPackage.getCleverCore().getInstance().exportablePkgList,
        articleToEdit: articleToEdit,
        packageName: ArticlesPackage.name,
        imageList: JSON.stringify(imageList),
        galleryList: JSON.stringify(galleryList),
        user: req.user,
        csrfToken: req.csrfToken()
      }));
    } catch (e) {
      util.passNext(next, e)
    }
  }

  File.getImageList()
    .then(function(imageList) {
      Gallery.getGalleryList()
        .then(function(galleryList) {
          Article.getArticle(req.params.id)
            .then(render.bind(null, imageList, galleryList))
            .catch(util.passNext.bind(null, next));
        })
        .catch(util.passNext.bind(null, next));
    })
    .catch(util.passNext.bind(null, next));
};

exports.createArticle = function(ArticlesPackage, req, res, next) {

  function render(imageList, galleryList) {
    res.send(ArticlesPackage.render('admin/create', {
      packages: ArticlesPackage.getCleverCore().getInstance().exportablePkgList,
      packageName: ArticlesPackage.name,
      imageList: JSON.stringify(imageList),
      galleryList: JSON.stringify(galleryList),
      user: req.user,
      csrfToken: req.csrfToken()
    }));
  }

  File.getImageList()
    .then(function(imageList) {
      Gallery.getGalleryList()
        .then(render.bind(null, imageList))
        .catch(util.passNext.bind(null, next));
    })
    .catch(util.passNext.bind(null, next));

};
