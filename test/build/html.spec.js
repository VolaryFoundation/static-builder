
var assert = require('assert')
var buildHTML = require('../../lib/build/html')

describe('build/html.js', function() {

  it('should basically work', function(done) {
    buildHTML(__dirname + '/../fixtures', { foo: 'bar' }).then(function(htmls) {
      assert(htmls.length == 2)
      done()
    })
  })
})
