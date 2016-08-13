# Ghost DreamObjects Storage

This module allows you to store media file at Dreamhost's DreamObects instead of storing on local machine, especially helpful for ghost blog hosted at heroku (no local storage). Work with latest version 0.9.0 of Ghost!

## Installation

```bash
# run from ghost root directory
npm install --save ghost-dreamobjects-storage
```

## Create storage module

Create Storage plugin

```bash
# run from ghost root directory
mkdir -p content/storage/ghost-dreamobjects-storage
echo "'use strict';" > content/storage/ghost-dreamobjects-storage/index.js
echo "module.exports = require('ghost-dreamobjects-storage');" >> content/storage/ghost-dreamobjects-storage/index.js
```

The file `content/storage/ghost-dreamobjects-storage/index.js` should look like this:

```javascript
'use strict';
module.exports = require('ghost-dreamobjects-storage');
```

## Configuration

Create new DreamObjects bucket and (if needed a new User with permissions
allowed to put and get object from that bucket). Enable public access to this
folder so that your img URLs are accessible for those browsing your site.
Note the new the bucket name, access key, and access key secret.

Add `storage` block to file `config.js` in each environment as below:

```javascript
storage: {
  active: 'ghost-dreamobjects-storage',
  'ghost-dreamobjects-storage': {
    accessKeyId: '<access key or env var that will be passed to app>',
    secretAccessKey: '<access secret or env var that will be passed to app>',
    bucket: '<bucket name>'
  }
}
```

## Copyright & License

Portions by Hoang Pham Huu Copyright (c) 2015 Hoang Pham Huu <phamhuuhoang@gmail.com>

Portions by Nicholas Marus Copyright (c) 2016 Nicholas Marus <nmarus@gmail.com>

Released under the [MIT license](https://github.com/muzix/ghost-s3/blob/master/LICENSE).
