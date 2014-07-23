
var http = require('http')
var url = require('url')
var _ = require('lodash')

var server = null
var html = {}
var css = {}
var js = {}

function serve(files, options) {

  _.extend(html, files.html)
  _.extend(css, files.css)
  _.extend(js, files.js)

  if (!server) {
    server = http.createServer(function (req, res) {

      var urlParts = url.parse(req.url)
      
      var file = urlParts.pathname.slice(1)

      if (!file) file = 'index.html'

      if (_.contains(file, '.html')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html[file] || '');
      }

      if (_.contains(file, '.css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css[file] || '');
      }

      if (_.contains(file, '.js')) {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(js[file] || '');
      }

    }).listen(options.port || 1234)
  }
  return server
}

module.exports = serve
