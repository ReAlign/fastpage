#!/usr/bin/env node

'use strict';

let fs = require('fs');
let path = require('path');
let commander = require('commander');
let log = require('n-s-logs');

var fpConfig = {};

global.fp = {
    root: path.join(process.cwd())
};

let isFileExist = (path) => {
    try {
        return fs.existsSync(path);
    } catch (e) {
        return false;
    }
};

let combineFpConfPath = () => {
    let fpConfigPath = path.join(global.fp.root, 'fastpage.config.js');

    if(isFileExist(fpConfigPath)) {
        return fpConfigPath;
    } else {
        log.error('Can\'t find fastpage.config.js, please make sure the file exists.');
        return null;
    }
};

let tryRequireConfList = (str, reqStr) => {
    let fpConfigPath = combineFpConfPath();

    if (!fpConfigPath) {
        return false;
    }

    try {
        fpConfig = require(fpConfigPath);
        if(!fpConfig[str]) {
            log.error('Can\'t find ' + str + ' list config, please make sure the config exists.');
            return false;
        }

        let reqByReqStr = (reqStr, obj) => {
            require(reqStr).init(obj);
        }

        reqByReqStr(reqStr, fpConfig[str]);
    } catch (e) {
        log.error('Fail reading fastpage.config.js, please check your file.');
        return false;
    }
    return true;
};

let readyConfig = (str) => {
    tryRequireConfList(str, './../lib/inquirer.entry');
};

let getVersion = () => {
    let pack = require('../package.json');
    return `${pack.version}`;
};

let initFpConfigFile = () => {
    require('./../lib/init').run();
};

let createStructureAsConfig = (str) => {
    tryRequireConfList(str, './../lib/create.structure');
};

commander
    .version(getVersion())
    .option('-v, --versions', 'output the version number')
    .option('-i, --init', 'init fastpage.config.js configuration files')
    .option('-c, --create <lang>', 'create the structure as configured')
    .option('-r, --no-run [db]', 'execute command generated page, with no arguments, the default parameters for the \'page\'')
    .parse(process.argv);

if(commander.versions) {
    log.show(getVersion());
    process.exit(1);
}

if(commander.init) {
    initFpConfigFile();
    return false;
}

if(commander.create) {
    createStructureAsConfig(commander.create);
    return false;
}

if (commander.run) {
    var strR = typeof commander.run === 'boolean' ? 'page' : commander.run;
    readyConfig(strR);
}