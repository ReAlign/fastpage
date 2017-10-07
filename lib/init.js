'use strict';

let fs = require('fs');
let path = require('path');
let log = require('./util/log');

let root = global.fp.root;

let copyFile = function (src, tar) {
    fs.createReadStream(src).pipe(fs.createWriteStream(tar));
};

let init = {
    run: function () {
        this.initConfig();
    },
    initConfig: function () {
        var confSrc = path.join(__dirname, './../sample/fastpage.config.js');
        var confTar = path.join(root, 'fastpage.config.js');
        fs.exists(confTar, function (data, err) {
            if (!err && !data) {
                copyFile(confSrc, confTar);
                log.ok('fastpage.config.js created.');
            } else {
                log.warn('fastpage.config.js already exists.');
            }

            process.exit(1);
        });
    }
};

module.exports = init;