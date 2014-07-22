
var util = require('../util')
var rsvp = require('rsvp')

module.exports = function(data, options) {

  return util.glob(options.srcPath + '/**/*.html')
    .then(util.mapWith(util.readFile, { includeSrc: true }))
    .then(function(srcAndFiles) {
      return srcAndFiles.reduce(function(memo, arr) {
        memo[arr[0].replace(options.srcPath, '')] = arr[1]
        return memo
      }, {})
    })

}
