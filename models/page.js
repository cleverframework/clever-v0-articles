'use strict';

// Module dependencies
const cleverCore = require('clever-core');
const config = cleverCore.loadConfig();
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const _ = require('lodash');
const Q = require('q');
const async = require('async');
const moment = require('moment');

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

// Validations
function validateUniqueSlug(value, callback) {
  const Page = mongoose.model('Page');
  Page.find({
    $and: [{
      slug: value,
      deleted: false
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, gallery) {
    callback(err || gallery.length === 0);
  });
};

// Getter
function escapeProperty(value) {
  return _.escape(value);
};

// Schema
const PageSchema = new Schema({
  title: {
    type: String,
    required: true,
    get: escapeProperty
  },
  slug: {
    type: String,
    required: true,
    // TODO: match valid slug chars
    validate: [validateUniqueSlug, 'Slug is already in-use']
  },
  standfirst: {
    type: String,
    default: '',
    get: escapeProperty
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date
  },
  blocks: {
    type: Object,
    default: {}
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

// Virtuals
PageSchema.virtual('created_ago').set(function(url) {
  throw new Error('Page::created_ago cannot be set.');
}).get(function() {
  if(this.created === null) return null;
  return moment(this.created).fromNow();
});

PageSchema.virtual('modified_ago').set(function(url) {
  throw new Error('Page::modified_ago cannot be set.');
}).get(function() {
    if(!this.modified || this.modified === null) return null;
  return moment(this.modified).fromNow();
});

PageSchema.virtual('created_format').set(function(url) {
  throw new Error('Page::created_format cannot be set.');
}).get(function() {
  if(this.created === null) return null;
  return moment(this.created).format('MM/DD/YYYY hh:mm:ss');
});

PageSchema.virtual('modified_format').set(function(url) {
  throw new Error('Page::modified_format cannot be set.');
}).get(function() {
  if(!this.modified || this.modified === null) return null;
  return moment(this.modified).format('MM/DD/YYYY hh:mm:ss');
});

PageSchema.virtual('start_format').set(function(url) {
  throw new Error('Page::start_format cannot be set.');
}).get(function() {
  if(this.start === null) return null;
  return moment(this.start).format('MM/DD/YYYY hh:mm:ss');
});

PageSchema.virtual('end_format').set(function(url) {
  throw new Error('Page::end_format cannot be set.');
}).get(function() {
  if(!this.end || this.end === null) return null;
  return moment(this.end).format('MM/DD/YYYY hh:mm:ss');
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
    Page.find({deleted: false}, {}, options, function(err, pages) {
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
    Page.findOne({_id: id, deleted: false}, function(err, page) {
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

      page.modified = Date.now();

      page.save(function(err) {
        const errors = hasErrors(err);
        if(errors) return defer.reject(errors);
        defer.resolve(page);
      });
    }

    Page.getPage(id)
      .then(save)
      .catch(defer.reject);

    return defer.promise;
  },

  /**
   * deletePage - delete logically the page matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  deletePage: function(id) {
    if(!id) throw new Error('Page.deletePageById: id parameter is mandatory');
    // const Page = mongoose.model('Page');
    // const defer = Q.defer();
    //
    // Page.remove({_id: page._id}, function(err, result) {
    //   if (err) return defer.reject(err);
    //   return defer.resolve(result);
    // });
    //
    // return defer.promise;
    return this.editPage(id, {deleted: true})
  },

  createPage: function(pageParams) {
    const Page = mongoose.model('Page');
    const page = new Page(pageParams);

    const defer = Q.defer();
    page.save(function(err) {
      const errors = hasErrors(err);
      if(errors) return defer.reject(errors);
      defer.resolve(page);
    });

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
