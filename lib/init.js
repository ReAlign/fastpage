'use strict';

let fs = require('fs');
let path = require('path');
let log = require('n-s-logs');

let root = global.fp.root;

let copyFile = (src, tar) => {
    fs.createReadStream(src).pipe(fs.createWriteStream(tar));
};

let init = {
    run() {
        this.initConfig();
    },
    initConfig() {
        const confSrc = path.join(__dirname, './../sample/fastpage.config.js');
        const confTar = path.join(root, 'fastpage.config.js');

        fs.existsSync(confTar) ? this.existsWarn() : this.createFile(confSrc, confTar);
    },
    existsWarn() {
        log.warn('already exists: fastpage.config.js');
    },
    createFile(confSrc, confTar) {
        copyFile(confSrc, confTar);
        log.ok('fastpage.config.js created.');
    }
};

module.exports = init;