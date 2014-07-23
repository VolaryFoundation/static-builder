
var _ = require('lodash')
var through = require('through')
var rsvp = require('rsvp')
var browserify = require('browserify')
var util = require('../util')

function pushOrInit(obj, k, v) {
  (obj[k] || (obj[k] = [])).push(v)
  return obj
}

module.exports = function(data, options) {

  return util.glob(options.srcPath + '/**/*.js')
    .then(function(fullPaths) {

      var paths = fullPaths.map(function(p) {
        return p.replace(options.srcPath, '')
      })

      var bundleNames = paths.map(function(p) {
        return './' + p.replace('.js', '')
      })

      var pathBundles = bundleNames.reduce(function(memo, p, i) {
        var splits = p.split('.')
        if (splits.length > 2) {
          return pushOrInit(memo, _.last(splits), p)
        } else {
          return pushOrInit(memo, 'main', p)
        }
      }, {})

      // store previously bundled modules
      var alreadyBundled = []
      var queue = []
      function dequeue() { if (queue[0]) queue.pop()() }

      var bundles =  _.reduce(pathBundles, function(memo, files, name) {
        memo[name + '.js'] = new rsvp.Promise(function(res, rej) {
          queue.push(function() {
            browserify({ basedir: options.srcPath })
              .external(alreadyBundled)
              .require(files)
              .bundle({ debug: true }, function(e, data) {
                if (e) rej(e)
                else {
                  alreadyBundled = alreadyBundled.concat(files)
                  res(data)
                  dequeue()
                }
              })
          })
        })

        return memo
      }, {})

      dequeue()

      return rsvp.hash(bundles)
    })
}

