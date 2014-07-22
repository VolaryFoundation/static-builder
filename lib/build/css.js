
var _ = require('lodash')
var sass = require('node-sass')

var util = require('../util')

module.exports = function(data, options) {
  data || (data = {})

  return util.glob(options.srcPath + '/**/*.scss')
    .then(util.mapWith(util.readFile, { includeSrc: true }))
    .then(function(srcAndFiles) {
      return srcAndFiles.reduce(function(memo, arr) {

        var compiled = _.template(arr[1], data)
        var css = sass.renderSync({
          data: compiled
        })

        memo[arr[0].replace(options.srcPath, '').replace('.scss', '.css')] = css

        return memo

      }, {})
    }).catch(console.log.bind(console, 'CSS ERROR: '))
}
