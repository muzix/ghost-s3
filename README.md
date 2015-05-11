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

## License

Read LICENSE
