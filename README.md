# Ghost S3 Storage

This module allows you to store media file at Amazon S3 instead of storing at local machine, especially helpful for ghost blog hosted at heroku (no local storage). Will work with version 0.5.8 of Ghost!

## Installation

    npm install --save ghost-s3-storage@0.1.6

## Configuration

Create new Amazon S3 bucket and new IAM User with permissions allowed to put and get object from that bucket. Remember saving ACCESS_KEY and ACCESS_SECRET_KEY.

Add `aws` block to file `config.js` as below:

    aws: {
        accessKeyId: Put_your_access_key_here,
        secretAccessKey: Put_your_secret_key_here,
        bucket: Put_your_bucket_name,
        region: Put_your_bucket_region,
        assetHost: Put_your_s3_full_url (*optional)
    }


**Note**
You can use assetHost config to specify S3 bucket full-url in virtual host style, path style or custom domain (http://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html)

- Virtual-host style example: ['https://blogthucdon24bucket.s3.amazonaws.com/2015/Feb/follow_your_dreams1-1424940431463.jpg'](https://blogthucdon24bucket.s3.amazonaws.com/2015/Feb/follow_your_dreams1-1424940431463.jpg)

- Path style example: ['https://s3-ap-southeast-1.amazonaws.com/blogthucdon24bucket/2015/Feb/follow_your_dreams1-1424940431463.jpg'](https://s3-ap-southeast-1.amazonaws.com/blogthucdon24bucket/2015/Feb/follow_your_dreams1-1424940431463.jpg)

Edit `core/server/storage/index.js` file look like below:

    var errors  = require('../errors'),
    storage = {},
    config;

    function getConfigModule() {
        if (!config) {
            config = require('../config');
        }
        return config;
    }


    function getStorage(storageChoice) {
        // TODO: this is where the check for storage apps should go
        // Local file system is the default.  Fow now that is all we support.
        // storageChoice = 'local-file-store';
        storageChoice = 'ghost-s3-storage';

        if (storage[storageChoice]) {
            return storage[storageChoice];
        }

        try {
            // TODO: determine if storage has all the necessary methods.
            //storage[storageChoice] = require('./' + storageChoice);
            storage[storageChoice] = require(storageChoice)({
                errors: errors,
                config: getConfigModule().aws
            });
        } catch (e) {
            errors.logError(e);
        }

        // Instantiate and cache the storage module instance.
        storage[storageChoice] = new storage[storageChoice]();

        return storage[storageChoice];
    }

    module.exports.getStorage = getStorage;

Restart app then test upload new image in blog post. Image will be store at newly S3 bucket.

## License

Read LICENSE
