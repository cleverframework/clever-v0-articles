'use strict';

// Module dependencies.
const config = require('clever-core').loadConfig();
const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const File = mongoose.model('File');
const async = require('async');
const util = require('../util');

// Show page list
exports.showPages = function(PagesPackage, req, res, next) {
  let page = Number.parseInt(req.query.page);
  page = Number.isNaN(page) ? 0 : page;
  const skip = page * 10;

  function renderPageList(pages, nPages) {
    console.log('Rendering pages...');
    try {
      res.send(PagesPackage.render('admin/list', {
        packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
        user: req.user,
        pages: pages,
        nPages: nPages,
        activePage: page,
        csrfToken: req.csrfToken()
      }));
    } catch (e) {
      next(e);
    }
  }

  async.parallel([
    function getPages(cb){
      Page.getPages(skip, 10)
        .then(function(pages) {
          async.each(pages, function(page, done) {
            page.loadImages()
              .then(function() {
                done();
              })
              .catch(done);
          }, function(err) {
            if(err) return cb(err);
            cb(null, pages);
          });
        })
        .catch(util.passNext.bind(null, cb));
    },
    function countPages(cb){
      Page.countPages()
        .then(function(nPages) {
          cb(null, nPages);
        })
        .catch(util.passNext.bind(null, cb));
    }
  ], function(err, options){
      if(err) return util.passNext.bind(null, next);
      renderPageList.apply(null, options);
  });

};

exports.showPage = function(PagesPackage, req, res, next) {

  function render(pageToShow, images) {
    res.send(PagesPackage.render('admin/page/details', {
      packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
      user: req.user,
      pageToShow: pageToShow,
      images: images,
      csrfToken: req.csrfToken()
    }));
  }

  Page.getPageById(req.params.id)
    .then(function(pageToShow) {
      pageToShow.loadImages()
        .then(render.bind(null, pageToShow))
        .catch(util.passNext.bind(null, next))
    })
    .catch(util.passNext.bind(null, next));
};

exports.createPage = function(PagesPackage, req, res, next) {
  res.send(PagesPackage.render('admin/create', {
    packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
    user: req.user,
    csrfToken: req.csrfToken()
  }));
};

exports.editPage = function(PagesPackage, req, res, next) {
  function render(pageToEdit) {
    res.send(PagesPackage.render(`admin/page/edit`, {
      packages: PagesPackage.getCleverCore().getInstance().exportablePkgList,
      user: req.user,
      pageToEdit: pageToEdit,
      csrfToken: req.csrfToken()
    }));
  }

  Page.getPageById(req.params.id)
    .then(render)
    .catch(util.passNext.bind(null, next));
};
