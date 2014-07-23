
var _ = require('lodash')
var rsvp = require('rsvp')

var build = require('./build')
var upload = require('./upload')
var serve = require('./serve')

function formatOptions(opts) {
  var formatted = _.clone(opts)
  formatted.srcPath = formatted.srcPath.replace(/\/$/, '') + '/'
  return formatted
}

module.exports = function(rawDefaults) {
  if (!rawDefaults.srcPath) throw "Requires srcPath option. Yes, it is weird to require an option."

  var defaults = formatOptions(rawDefaults)

  function mergeOptions(opts) {
    return _.extend({}, defaults, opts)
  }

  var api = {

    buildJS: build.js,
    buildCSS: build.css,
    buildHTML: build.html,

    build: function(data, options) {
      return rsvp.hash({
        js: api.buildJS(data, options), 
        css: api.buildCSS(data, options),
        html: api.buildHTML(data, options)
      })
    },

    upload: function(files, options) {
      return upload(files, mergeOptions(options))
    },

    serve: function(files, options) {
      return serve(files, mergeOptions(options))
    },

    buildAndServe: function(data, options) {
      var fullOptions = mergeOptions(options)
      return api.build(data, fullOptions).then(function(files) {
        return api.serve(files, fullOptions)
      })
    },

    buildAndUpload: function(data, options) {
      return api.build(data).then(function(files) {
        return api.upload(files, mergeOptions(options))
      })
    }
  }

  return api
}
