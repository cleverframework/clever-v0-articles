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
  const Article = mongoose.model('Article');
  Article.find({
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
const ArticleSchema = new Schema({
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
  published: {
    type: Boolean,
    default: false
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
ArticleSchema.virtual('created_ago').set(function(url) {
  throw new Error('Article::created_ago cannot be set.');
}).get(function() {
  if(this.created === null) return null;
  return moment(this.created).fromNow();
});

ArticleSchema.virtual('modified_ago').set(function(url) {
  throw new Error('Article::modified_ago cannot be set.');
}).get(function() {
    if(!this.modified || this.modified === null) return null;
  return moment(this.modified).fromNow();
});

ArticleSchema.virtual('created_format').set(function(url) {
  throw new Error('Article::created_format cannot be set.');
}).get(function() {
  if(this.created === null) return null;
  return moment(this.created).format('MM/DD/YYYY hh:mm:ss');
});

ArticleSchema.virtual('modified_format').set(function(url) {
  throw new Error('Article::modified_format cannot be set.');
}).get(function() {
  if(!this.modified || this.modified === null) return null;
  return moment(this.modified).format('MM/DD/YYYY hh:mm:ss');
});

ArticleSchema.virtual('start_format').set(function(url) {
  throw new Error('Article::start_format cannot be set.');
}).get(function() {
  if(this.start === null) return null;
  return moment(this.start).format('MM/DD/YYYY hh:mm:ss');
});

ArticleSchema.virtual('end_format').set(function(url) {
  throw new Error('Article::end_format cannot be set.');
}).get(function() {
  if(!this.end || this.end === null) return null;
  return moment(this.end).format('MM/DD/YYYY hh:mm:ss');
});

// Static Methods
ArticleSchema.statics = {
  /**
   * CountPages - return the number of pages
   *
   * @return {Object}
   * @api public
   */
  countPages: function() {
    const Article = mongoose.model('Article');
    const defer = Q.defer();
    Article.count({}, function(err, nPages) {
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
    const Article = mongoose.model('Article');
    const options = skip && limit ? {skip: skip, limit: limit} : {};
    const defer = Q.defer();
    Article.find({deleted: false}, {}, options, function(err, pages) {
      if (err) return defer.reject(err);
      return defer.resolve(pages);
    }).sort({ _id: -1 });
    return defer.promise;
  },

  /**
   * GetPage - return the article matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  getPage: function(id) {
    if(!id) throw new Error('Article.getPageById: id parameter is mandatory');
    const Article = mongoose.model('Article');
    const defer = Q.defer();
    Article.findOne({_id: id, deleted: false}, function(err, article) {
      if (err) return defer.reject(err);
      return defer.resolve(article);
    });
    return defer.promise;
  },

  /**
   * EditPageById - edit the article matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  editPage: function(id, pageParams) {

    if(!id) throw new Error('Article.editPageById: id parameter is mandatory');
    const Article = mongoose.model('Article');
    const defer = Q.defer();

    function save(article) {

      // Reset
      article.private = false;

      Object.keys(pageParams).forEach(function (key, index) {
        article[key] = pageParams[key];
      });

      article.modified = Date.now();

      article.save(function(err) {
        const errors = hasErrors(err);
        if(errors) return defer.reject(errors);
        defer.resolve(article);
      });
    }

    Article.getPage(id)
      .then(save)
      .catch(defer.reject);

    return defer.promise;
  },

  /**
   * deletePage - delete logically the article matching the id
   *
   * @param {String} id
   * @return {Object}
   * @api public
   */
  deletePage: function(id) {
    if(!id) throw new Error('Article.deletePageById: id parameter is mandatory');
    // const Article = mongoose.model('Article');
    // const defer = Q.defer();
    //
    // Article.remove({_id: article._id}, function(err, result) {
    //   if (err) return defer.reject(err);
    //   return defer.resolve(result);
    // });
    //
    // return defer.promise;
    return this.editPage(id, {deleted: true})
  },

  createPage: function(pageParams) {
    const Article = mongoose.model('Article');
    const article = new Article(pageParams);

    const defer = Q.defer();
    article.save(function(err) {
      const errors = hasErrors(err);
      if(errors) return defer.reject(errors);
      defer.resolve(article);
    });

    return defer.promise;
  }
}

// Instance Methods
ArticleSchema.methods = {

  /**
   * GetData - get article data
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

mongoose.model('Article', ArticleSchema);
