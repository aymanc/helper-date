'use strict';

/**
 * Module dependences
 */

var typeOf = require('kind-of');
var date = require('date.js');
var moment = require('moment');
var extend = require('extend-shallow');

module.exports = function momentHelper(str, pattern, options) {
  // if no args are passed, return a formatted date
  if (str == null && pattern == null) {
    // moment.locale('en'); ---- So the thing is that: 
    // The changes you do in this helper via something like {{moment lang='fr'}}
    // will affect your moment package settings being used in your project. if u're doing multilingual it's a problem
    // You want to remove this and be dependant on the locale in your project whatever it may be. 
    // english being the default anyway
    return moment().format('MMMM DD, YYYY');
  }

  var opts = {lang: 'en', date: new Date()};
  opts = extend({}, opts, str, pattern, options);
  opts = extend({}, opts, opts.hash);

  // set the language to use
  // moment.locale(opts.lang); ---- Ok So The Same thing here. 
  // you want to use the locale setting option inside the moment() function instead for it to be a one time thing
  
  if (opts.datejs === false) {
    return moment(new Date(str), null, opts.lang).format(pattern); // As such
  }
  // if both args are strings, this could apply to either lib.
  // so instead of doing magic we'll just ask the user to tell
  // us if the args should be passed to date.js or moment.
  if (typeof str === 'string' && typeof pattern === 'string') {
    return moment(date(str), null, opts.lang).format(pattern); // Same thing here
  }

  // If handlebars, expose moment methods as hash properties
  if (opts.hash) {
    if (opts.context) {
      extend(opts.hash, opts.context);
    }

    var res = moment(str, null, opts.lang); // And here
    for (var key in opts.hash) {
      if (res[key]) {
        return res[key](opts.hash[key]);
      } else {
        console.log('moment.js does not support "' + key + '"');
      }
    }
  }

  if (typeOf(str) === 'object') {
    return moment(str, null, opts.lang).format(pattern); // Here
  }

  // if only a string is passed, assume it's a date pattern ('YYYY')
  if (typeof str === 'string' && !pattern) {
    return moment(null, null, opts.lang).format(str); // Here
  }

  return moment(str, null, opts.lang).format(pattern); // And finally here
};
