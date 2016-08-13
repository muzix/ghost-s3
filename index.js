'use strict';

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var when = require('when');
var nodefn = require('when/node/function');
var AWS = require('aws-sdk');
var readFile = nodefn.lift(fs.readFile);
var unlink = nodefn.lift(fs.unlink);

function getTargetDir() {
  return moment().format('YYYY/MM/');
};

function getTargetName(image, targetDir) {
  var ext = path.extname(image.name);
  var name = path.basename(image.name, ext).replace(/\W/g, '_');

  return targetDir + name + '-' + moment().unix() + ext;
};

function DOStore(config) {
  this.config = config || {};
}

DOStore.prototype.save = function(image) {

  // validate
  if (this.config === {} || !this.config.accessKeyId || !this.config.secretAccessKey || !this.config.bucket) {
    return when.reject('ghost-dreamobjects is not configured');
  }

  var targetDir = getTargetDir();
  var targetFilename = getTargetName(image, targetDir);

  var region = this.config.region ? this.config.region : 'objects-us-west-1';
  var endpoint = 'https://' + region + '.dream.io';

  return readFile(image.path)
    .then(buffer => {
      var s3 = new AWS.S3({
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
        endpoint: endpoint
      });

      return nodefn.call(s3.putObject.bind(s3), {
        ACL: 'public-read',
        Bucket: this.config.bucket,
        Key: targetFilename,
        Body: buffer,
        ContentType: image.type,
        CacheControl: 'max-age=' + (30 * 24 * 60 * 60) // 30 days
      });
    })
    .then(result => {
      console.log('ghost-dreamobjects', 'Temp uploaded file path: ' + image.path);
    })
    .then(() => {
      return when.resolve(endpoint + '/' + this.config.bucket + '/' + targetFilename);
    })
    .catch(err => {
      console.log(err.stack);
    });
};


// middleware for serving the files
DOStore.prototype.serve = function() {
  // a no-op, these are absolute URLs
  return function (req, res, next) {
    next();
  };
};

module.exports = DOStore;
