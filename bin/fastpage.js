#!/usr/bin/env node

'use strict';

let fs = require('fs');
let path = require('path');
let commander = require('commander');
let log = require('./../lib/util/log');

var fpConfig = {};

global.fp = {
    root: path.join(process.cwd())
};

let isFileExist = function (path) {
    try {
        return fs.existsSync(path);
    } catch (e) {
        return false;
    }
};

let readyConfig = function (str) {
    let fpConfigPath = path.join(global.fp.root, 'fastpage.config.js');

    if (!isFileExist(fpConfigPath)) {
        log.error('Can\'t find fastpage.config.js, please make sure the file exists.');
        return false;
    }

    try {
        fpConfig = require(fpConfigPath);
        if(!fpConfig[str]) {
            log.error('Can\'t find ' + str + ' list config, please make sure the config exists.');
            return false;
        }
        require('./../lib/inquirer.entry').init(fpConfig[str]);
    } catch (e) {
        log.error('Fail reading fastpage.config.js, please check your file.');
        return false;
    }
    return true;
};

let getVersion = function () {
    let pack = require('../package.json');
    return `${pack.version}`;
};

let initFpConfigFile = function () {
    require('./../lib/init').run();
};

commander
    .version(getVersion())
    .option('-v, --versions', 'output the version number')
    .option('-i, --init', 'init fastpage.config.js configuration files')
    .option('-r, --no-run [db]', 'execute command generated page, with no arguments, the default parameters for the \'page\'')
    .parse(process.argv);

if(commander.versions) {
    log.show(getVersion());
    process.exit(1);
}
if(commander.init) {
    initFpConfigFile();
}

if (commander.run) {
    var str = typeof commander.run === 'boolean' ? 'page' : commander.run;
    readyConfig(str);
}