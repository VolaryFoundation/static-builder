
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
      var bundles =  _.reduce(pathBundles, function(memo, files, name) {

        memo[name + '.js'] = new rsvp.Promise(function(res, rej) {
          browserify(files, { basedir: options.srcPath })
            .transform(function() {
              var data = ''
              return through(function(b) { data += b }, function() {
                this.queue(data)
                this.queue(null)
              })
            })
            .bundle({ debug: true }, util.handlePromise(res, rej))
        })

        return memo
      }, {})

      return rsvp.hash(bundles)
    })
}
