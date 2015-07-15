#UPDATE
Update version 0.2.1 for Ghost 0.6.0

# Ghost S3 Storage

This module allows you to store media file at Amazon S3 instead of storing at local machine, especially helpful for ghost blog hosted at heroku (no local storage). Work with latest version 0.6.0 of Ghost! (Use module version 0.1.7 for Ghost version < 0.6.0)

## Installation

    npm install --save ghost-s3-storage

## Create storage module

Create index.js file with folder path 'content/storage/ghost-s3/index.js' (manually create folder if not exist)

    'use strict';
    module.exports = require('ghost-s3-storage');

## Configuration

Create new Amazon S3 bucket and new IAM User with permissions allowed to put and get object from that bucket. Remember saving ACCESS_KEY and ACCESS_SECRET_KEY.

Add `storage` block to file `config.js` in each environment as below:

    storage: {
        active: 'ghost-s3',
        'ghost-s3': {
            accessKeyId: 'Put_your_access_key_here',
            secretAccessKey: 'Put_your_secret_key_here',
            bucket: 'Put_your_bucket_name',
            region: 'Put_your_bucket_region',
            assetHost: 'Put_your_cdn_url*'
        }
    },

**Note 1**
You can use assetHost config to specify S3 bucket full-url in virtual host style, path style or custom domain (http://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html)

- Virtual-host style example: ['https://blogthucdon24bucket.s3.amazonaws.com/2015/Feb/follow_your_dreams1-1424940431463.jpg'](https://blogthucdon24bucket.s3.amazonaws.com/2015/Feb/follow_your_dreams1-1424940431463.jpg)

- Path style example: ['https://s3-ap-southeast-1.amazonaws.com/blogthucdon24bucket/2015/Feb/follow_your_dreams1-1424940431463.jpg'](https://s3-ap-southeast-1.amazonaws.com/blogthucdon24bucket/2015/Feb/follow_your_dreams1-1424940431463.jpg)

Restart app then test upload new image in blog post. Image will be store at newly S3 bucket.

**Note 2**
Uploads will be saved in the specified S3 bucket using keys (paths) in the form of
`/year/month/imageName-timeStamp.ext`, where:

* year      - 4 digits of the current year;
* month     - 3 letter english abbreviation of the current month;
* imageName - the original file name, with special characters converted to "_";
* timeStamp - timestamp in milliseconds;
* ext       - the original file's extension (e.g. "png");

If, for whatever reason, you need to prefix that path with something, you can use
the `pathPrefix` config option, like so:

    pathPrefix: "some/path"

This will save files in `pathPrefix/year/month/...`, so you can neatly store ghost
files and either share the S3 bucket with other apps or use CloudFront prefix rules
as you see fit.

## License

Read LICENSE
