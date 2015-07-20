'use strict';

// Module dependencies
const cleverCore = require('clever-core');
const config = cleverCore.loadConfig();
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const _ = require('lodash');
const Q = require('q');
const async = require('async');

// Mongoose Error Handling
function hasErrors(err) {
  if (err) {
    console.log(err);
    let modelErrors = [];
    switch (err.code) {
      case 11000: {}
      default: {
        if (err.errors) {
          for (var x in err.errors) {
            modelErrors.push({
              param: x,
              msg: err.errors[x].message,
              value: err.errors[x].value
            });
          }
        }
      }
    }
    return modelErrors;
  }

  return null;
}

// Getter
function escapeProperty(value) {
  return _.escape(value);
};

// Schema
const PageSchema = new Schema({
  title: {
    type: String,
    default: 'Untitled',
    get: escapeProperty
  },
  comment: {
    type: String,
    default: '',
    get: escapeProperty
  },
  blocks: {},
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: null
  }
});

// Static Methods
PageSchema.statics = {
  /**
   * CountPages - return the number of pages
   *
   * @return {Object}
   * @api public
   */
  countPages: function() {
    const Page = mongoose.model('Page');
    const defer = Q.defer();
    Page.count({}, function(err, nPages) {
      if (err) return defer.reject(err);
      return defer.resolve(nPages);
    });
    return defer.promise;
  },

  /**
   * GetPages - return the list of pages
   *
   * @param {Integer} skip
   * @param {Integer} limit
   * @return {Object}
   * @api public
   */
  getPages: function(skip, limit) {
    const Page = mongoose.model('Page');
    const options = skip && limit ? {skip: skip, limit: limit} : {};
    const defer = Q.defer();
    Page.find({}, {}, options, function(err, pages) {
      if (err) return defer.reject(err);
      return defer.resolve(pages);
    }).sort({ _id: -1 });
    return defer.promise;
  },

  /**
   * GetPage - return the page matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  getPage: function(id) {
    if(!id) throw new Error('Page.getPageById: id parameter is mandatory');
    const Page = mongoose.model('Page');
    const defer = Q.defer();
    Page.findOne({_id: id}, function(err, page) {
      if (err) return defer.reject(err);
      return defer.resolve(page);
    });
    return defer.promise;
  },

  /**
   * EditPageById - edit the page matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  editPage: function(id, pageParams) {

    if(!id) throw new Error('Page.editPageById: id parameter is mandatory');
    const Page = mongoose.model('Page');
    const defer = Q.defer();

    function save(page) {

      // Reset
      page.private = false;

      Object.keys(pageParams).forEach(function (key, index) {
        page[key] = pageParams[key];
      });

      page.save(function(err) {
        const errors = hasErrors(err);
        if(errors) return defer.reject(errors);
        defer.resolve(page);
      });
    }

    Page.getPageById(id)
      .then(save)
      .catch(defer.reject);

    return defer.promise;
  },

  /**
   * DeletePageById - delete the page matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  deletePageById: function(id) {
    if(!id) throw new Error('Page.deletePageById: id parameter is mandatory');
    const Page = mongoose.model('Page');
    const defer = Q.defer();

    Page.getPageById(id)
      .then(function(page) {
        storage.deletePage(page.key)
          .then(function() {
            Page.remove({_id: page._id}, function(err, result) {
              if (err) return defer.reject(err);
              return defer.resolve(result);
            });
          })
          .catch(defer.reject);
      })
      .catch(defer.reject);

    return defer.promise;
  },

  createPage: function(pageParams, pageData) {
    const Page = mongoose.model('Page');
    const defer = Q.defer();

    storage.createPage(pageParams.key, pageData)
      .then(function() {
        const page = new Page(pageParams);
        page.save(function(err) {
          const errors = hasErrors(err);
          if(errors) return defer.reject(errors);
          defer.resolve(page);
        });
      })
      .catch(defer.reject)

    return defer.promise;
  }
}

// Instance Methods
PageSchema.methods = {

  /**
   * GetData - get page data
   *
   * @return {Buffer}
   * @api public
   */
  getData: function() {
    // const PageImage = mongoose.model('PageImage');
    const defer = Q.defer();

    // TODO: implementation

    return defer.promise;
  },

  /**
   * Hide security sensitive fields
   *
   * @returns {*|Array|Binary|Object}
   */
  toJSON: function() {
    const obj = this.toObject();
    obj.url = this.url;
    return obj;
  }
};

mongoose.model('Page', PageSchema);
