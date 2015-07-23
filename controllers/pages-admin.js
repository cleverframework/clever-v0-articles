'use strict';

// Module dependencies.
const config = require('clever-core').loadConfig();
const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const File = mongoose.model('File');
const Gallery = mongoose.model('Gallery');
const async = require('async');
const util = require('../util');

// Show user list
exports.showPages = function(PagesPackage, req, res, next) {

  let activePage = Number.parseInt(req.query.page);
  activePage = Number.isNaN(activePage) ? 0 : activePage;
  const skip = activePage * 10;

  function renderPageList(pages, nPages) {
    try {
      res.send(PagesPackage.render('admin/list', {
        packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
        user: req.user,
        pages: pages,
        nPages: nPages,
        activePage: activePage,
        csrfToken: req.csrfToken()
      }));
    } catch(e) {
      util.passNext(next, e);
    }
  }

  async.parallel([
    function getPages(cb){
      Page.getPages(skip, 10)
        .then(cb.bind(null, null))
        .catch(util.passNext.bind(null, cb));
    },
    function countPages(cb){
      Page.countPages()
        .then(cb.bind(null, null))
        .catch(util.passNext.bind(null, cb));
    }
  ], function(err, options){
      if(err) return util.passNext.bind(null, next);
      renderPageList.apply(null, options);
  });

};

exports.showPage = function(PagesPackage, req, res, next) {
  function render(imageList, galleryList, pageToShow) {
    res.send(PagesPackage.render('admin/details', {
      packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
      pageToShow: pageToShow,
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
          Page.getPage(req.params.id)
            .then(render.bind(null, imageList, galleryList))
            .catch(util.passNext.bind(null, next));
        })
        .catch(util.passNext.bind(null, next));
    })
    .catch(util.passNext.bind(null, next));
};

exports.editPage = function(PagesPackage, req, res, next) {
  function render(imageList, galleryList, pageToEdit) {
    try {
      res.send(PagesPackage.render('admin/edit', {
        packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
        pageToEdit: pageToEdit,
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
          Page.getPage(req.params.id)
            .then(render.bind(null, imageList, galleryList))
            .catch(util.passNext.bind(null, next));
        })
        .catch(util.passNext.bind(null, next));
    })
    .catch(util.passNext.bind(null, next));
};

exports.createPage = function(PagesPackage, req, res, next) {

  function render(imageList, galleryList) {
    res.send(PagesPackage.render('admin/create', {
      packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
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
