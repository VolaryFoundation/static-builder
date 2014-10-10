
var s3 = require('s3');
var fs = require('fs')
var _ = require('lodash')

function createTemporaryFiles(files) {
  var merged = _.merge.apply(_, _.values(files))
  return _.map(merged, function(content, name) {
    fs.writeFileSync(name, content)
    return name
  })
}

function upload(files, options) {

  var temps = createTemporaryFiles(files)

  var client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretKey,
    },
  })

  console.log(options.accessKeyId, options.secretKey)

  _.each(temps, function(temp) {

  })

  function send(path) {

    var params = {

      localFile: path,

      s3Params: {
        Bucket: options.bucket,
        Key: path,
      },
    };

    var uploader = client.uploadFile(params);

    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);

    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);

    });
    uploader.on('end', function() {
      console.log("done uploading");
      if (temps[0]) send(temps.pop())
    });

  }

  send(temps.pop())

}

module.exports = upload

