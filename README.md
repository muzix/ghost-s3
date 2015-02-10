# Ghost S3 Storage

This module allows you to store media file at Amazon S3 instead of storing at local machine, especially helpful for ghost blog hosted at heroku (no local storage). Will work with latest version 0.5.8 of Ghost!

## Installation

    npm install --save ghost-s3-storage

## Configuration

Create new Amazon S3 bucket and new IAM User with permissions allowed to put and get object from that bucket. Remember saving ACCESS_KEY and ACCESS_SECRET_KEY.

Add `aws` block to file `config.js` as below:

    aws: {
        accessKeyId: Put_your_access_key_here,
        secretAccessKey: Put_your_secret_key_here,
        bucket: Put_your_bucket_name,
        region: Put_your_bucket_region*
    }
    
    
**Note** If using US Standard for your amazon bucket region use the `s3-external-1` or `us-east-1.s3` for your buckets region name. Bucket Regions can be found [here](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)
    
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
