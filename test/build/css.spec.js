
var assert = require('assert')
var buildCSS = require('../../lib/build/css')

describe('build/css.js', function() {

  it('should basically work', function(done) {
    buildCSS(__dirname + '/../fixtures', { color: '#fff' }).then(function(css) {
      assert.ok(css.indexOf('this is a css fixture') > -1)
      done()
    })
  })

  it('should compile with dynamic data', function(done) {
    buildCSS(__dirname + '/../fixtures', { color: '#555' }).then(function(css) {
      assert.ok(css.indexOf('color: #555') > -1)
      done()
    })
  })
})
