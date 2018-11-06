#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const log = require('n-s-logs');

let fpConfig = {};

global.fp = {
    root: path.join(process.cwd())
};

const u = {};

u.isFileExist = (path) => {
    try {
        return fs.existsSync(path);
    } catch (e) {
        return false;
    }
};

u.combineFpConfPath = () => {
    let fpConfigPath = path.join(global.fp.root, 'fastpage.config.js');

    if(!u.isFileExist(fpConfigPath)) {
        log.error('Can\'t find fastpage.config.js, please make sure the file exists.');
        return null;
    }

    return fpConfigPath;
};

u.tryRequireConfList = (str, reqStr) => {
    let fpConfigPath = u.combineFpConfPath();

    if (!fpConfigPath) {
        return false;
    }

    try {
        fpConfig = require(fpConfigPath);
        if(!fpConfig[str]) {
            log.error(`Can't find ${str} list config, please make sure the config exists.'`);
            return false;
        }

        const reqByReqStr = (reqStr, obj) => {
            require(reqStr).init(obj);
        };

        reqByReqStr(reqStr, fpConfig[str]);
    } catch (e) {
        log.error('Fail reading fastpage.config.js, please check your file.');
        return false;
    }
    return true;
};

u.readyConfig = (str) => {
    u.tryRequireConfList(str, './../lib/inquirer.entry');
};

u.getVersion = () => {
    let pack = require('../package.json');
    return `${pack.version}`;
};

u.initFpConfigFile = () => {
    require('./../lib/init').run();
};

u.createStructureAsConfig = (str) => {
    u.tryRequireConfList(str, './../lib/create.structure');
};

commander
    .version(u.getVersion())
    .option('-v, --versions', 'output the version number')
    .option('-i, --init', 'init fastpage.config.js configuration files')
    .option('-c, --create <lang>', 'create the structure as configured')
    .option('-r, --no-run [db]', 'execute command generated page, with no arguments, the default parameters for the \'page\'')
    .parse(process.argv);

if(commander.versions) {
    log.show(u.getVersion());
    process.exit(1);
}

if(commander.init) {
    u.initFpConfigFile();
    return false;
}

if(commander.create) {
    u.createStructureAsConfig(commander.create);
    return false;
}

if (commander.run) {
    const strR = typeof commander.run === 'boolean' ? 'page' : commander.run;
    u.readyConfig(strR);
}