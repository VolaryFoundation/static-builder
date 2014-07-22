
var glob = require('glob')
var fs = require('fs')
var rsvp = require('rsvp')

var util = {

  promise: function(fn) {
    return new rsvp.Promise(fn)
  },

  handlePromise: function(res, rej) {
    return function(e, data) { e ? rej(e) : res(data) } 
  },
  
  glob: function(path) {
    return util.promise(function(res, rej) {
      glob(path, {}, util.handlePromise(res, rej))
    })
  },

  join: function(delim) {
    return function(arr) { return arr.join(delim) }
  },

  contains: function(str) {
    return function(testee) {
      return _.contains(testee, str)
    }
  },

  prepend: function(a) {
    return function(b) { return a + b }
  },

  readFile: function(path) {
    return util.promise(function(res, rej) {
      fs.readFile(path, 'utf-8', function(e, data) {
        e ? rej(e) : res(data)
      })
    })
  },

  mapWith: function(fn, opts) {
    opts || (opts = {})
    if (opts.includeSrc) {
      return function(arr) {
        return rsvp.all(arr.map(fn)).then(function(objs) {
          return objs.map(function(obj, i) { return [ arr[i], obj ] })
        })
      }
    } else {
      return function(arr) { return rsvp.all(arr.map(fn)) }
    }
  }
}

module.exports = util
