#!/usr/bin/env node

'use strict';

let fs = require('fs');
let path = require('path');
let inquirer = require('inquirer');
let chalk = require('chalk');
let log = require('./../lib/util/log');

let Cli = require('./../lib/cli');
let cli = new Cli();

let getVersion = function () {
    let pack = require('../package.json');
    log.show(`v ${pack.version}`);
};

let initFpConfigFile = function () {
    require('./../lib/init').run();
};

let printHelp = function () {
    log.show(
        `\n\n\tUsage: ` + chalk.green(`fp/fastpage`) + chalk.red(` [options]\n\n`) +
        chalk.bold.green(`\t\tfp/fastpage\t\t`) + chalk.yellow(`execute main task\n\n`) +
        `\toptions:\n\n` +
        chalk.bold.green(`\t\t-v/--version\t\t`) + chalk.yellow(`print version\n`) +
        chalk.bold.green(`\t\t-i/--init\t\t`) + chalk.yellow(`create fastpage.config.js\n`) +
        chalk.bold.green(`\t\t-h/--help\t\t`) + chalk.yellow(`print help\n\n`)
    );
};

cli.on(['-v', '--version'], getVersion);
cli.on(['-i', '--init'], initFpConfigFile);
cli.on(['-h', '--help'], printHelp);

var fpConfig = {};

global.fp = {
    root: path.join(process.cwd())
}

let isFileExist = function (path) {
    try {
        return fs.existsSync(path);
    } catch (e) {
        return false;
    }
};

let readyConfig = function () {
    let fpConfigPath = path.join(global.fp.root, 'fastpage.config.js');

    if (!isFileExist(fpConfigPath)) {
        log.error('Can\'t find fastpage.config.js, please make sure the file exists.');
        return false;
    }

    try {
        fpConfig = require(fpConfigPath);
        require('./../lib/inquirer.entry').run(fpConfig);
    } catch (e) {
        log.error('Fail reading fastpage.config.js, please check your file.');
        return false;
    }
    return true;
}

cli.normal = function () {
    readyConfig();
};

cli.parse(process.argv.slice(2));