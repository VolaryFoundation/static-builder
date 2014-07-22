
var assert = require('assert')

var buildJS = require('../../lib/build/js')

describe('build/build.js', function() {

  it('should basicall work', function(done) {
    this.timeout(5000)
    buildJS(__dirname + '/../fixtures').then(function(str) {
      assert.ok(str.indexOf('this is a js fixture') > -1)
      done()
    })
  })
})
