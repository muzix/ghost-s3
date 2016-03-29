'use strict';

// # S3 storage module for Ghost blog http://ghost.org/
var fs = require('fs');
var path = require('path');
var Bluebird = require('bluebird');
var AWS = require('aws-sdk-promise');
var moment = require('moment');
var readFileAsync = Bluebird.promisify(fs.readFile);
var options = {};

function S3Store(config) {
    options = config || {};
}

function getAwsPath(bucket) {
    var awsPath = 'https://' + bucket + '.s3.amazonaws.com/';
    return awsPath;
}

function logError(error) {
    console.log('error in ghost-s3', error);
};

function logInfo(info) {
    console.log('info in ghost-s3', info);
};

S3Store.prototype.save = function(image) {
    var self = this;
    if (!options) return Bluebird.reject('ghost-s3 is not configured');

    var targetDir = self.getTargetDir();
    var targetFilename = self.getTargetName(image, targetDir);

    var s3 = new AWS.S3({
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        bucket: options.bucket,
        region: options.region
    });

    return readFileAsync(image.path)
        .then(function(buffer) {
            var params = {
                ACL: 'public-read',
                Bucket: options.bucket,
                Key: targetFilename,
                Body: buffer,
                ContentType: image.type,
                CacheControl: 'max-age=' + (365 * 24 * 60 * 60) // 365 days
            };

            return s3.putObject(params).promise();
        })
        .tap(function() {
            logInfo('ghost-s3', 'Temp uploaded file path: ' + image.path);
        })
        .then(function(results) {
            var awsPath = getAwsPath(options.bucket);
            return Bluebird.resolve(awsPath + targetFilename);
        })
        .catch(function(err) {
            logError(err);
            throw err;
        });
};

// middleware for serving the files
S3Store.prototype.serve = function() {
    var s3 = new AWS.S3({
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        bucket: options.bucket,
        region: options.region
    });

    return function (req, res, next) {
        var params = {
            Bucket: options.bucket,
            Key: req.path.replace(/^\//, '')
        };

        s3.getObject(params)
            .on('httpHeaders', function(statusCode, headers, response) {
                res.set(headers);
            })
            .createReadStream()
            .on('error', function(err) {
                res.status(404);
                next();
            })
            .pipe(res);
    };
};

S3Store.prototype.getTargetDir = function() {
    var now = moment();
    return now.format('YYYY/MM/');
};

S3Store.prototype.getTargetName = function(image, targetDir) {
    var ext = path.extname(image.name);
    var name = path.basename(image.name, ext).replace(/\W/g, '_');

    return targetDir + name + '-' + Date.now() + ext;
};



module.exports = S3Store;
