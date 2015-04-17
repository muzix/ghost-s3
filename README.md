#UPDATE
Update version 0.2.0 for Ghost 0.6.0

# Ghost S3 Storage

This module allows you to store media file at Amazon S3 instead of storing at local machine, especially helpful for ghost blog hosted at heroku (no local storage). Work with latest version 0.6.0 of Ghost! (Use module version 0.1.6 for Ghost version < 0.6.0)

## Installation

    npm install --save ghost-s3-storage

## Create storage module

- Create index.js file with folder path 'content/storage/ghost-s3/index.js' (manually create folder if not exist)

    'use strict';
    module.exports = require('ghost-s3-storage');

## Configuration

Create new Amazon S3 bucket and new IAM User with permissions allowed to put and get object from that bucket. Remember saving ACCESS_KEY and ACCESS_SECRET_KEY.

Add `storage` block to file `config.js` in each environment as below:

    storage: {
        active: 'ghost-s3',
        'ghost-s3': {
            accessKeyId: Put_your_access_key_here,
            secretAccessKey: Put_your_secret_key_here,
            bucket: Put_your_bucket_name*,
            region: Put_your_bucket_region*
            assetHost: Put_your_cdn_url*
        }
    }

**Note 1**
If full url of amazon s3 is "https://foobucket.s3.amazonaws.com" then bucket config is: 'foobucket.s3' (include string quote)

**Note 2**
If using US Standard for your amazon bucket region use the `s3-external-1` or `us-east-1.s3` for your buckets region name. Bucket Regions can be found [here](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)

**Note 3**
assetHost config will bypass bucket name config. You can put full url of your amazon s3 bucket or put your cdn host url here.

Restart app then test upload new image in blog post. Image will be store at newly S3 bucket.

## License

Read LICENSE
