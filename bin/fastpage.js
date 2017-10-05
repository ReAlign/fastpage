#!/usr/bin/env node

'use strict';

let fs = require('fs');
let path = require('path');
let inquirer = require('inquirer');
let chalk = require('chalk');
let extend = require('node.extend');
let log = require('./../lib/util/log');

let Cli = require('../lib/cli');
let cli = new Cli();

let showVersion = function () {
    let pack = require('../package.json');
    log.show(`v ${pack.version}`, 'fp');
};

let initFpConfigFile = function () {
    require('./../lib/init').run();
};

let printHelp = function () {
    log.show(
        `\n\n\tUsage: ` + chalk.green(`fp/fastpage`) + chalk.red(` [options]\n\n`) +
        chalk.bold.green(`\t\tfp/fastpage\t\t`) + chalk.yellow(`execute main task\n\n`) +
        `\toptions:\n\n` +
        chalk.bold.green(`\t\t-v/--version\t\t`) + chalk.yellow(`version\n`) +
        chalk.bold.green(`\t\t-i/--init\t\t`) + chalk.yellow(`init fastpage config file\n`) +
        chalk.bold.green(`\t\t-h/--help\t\t`) + chalk.yellow(`help\n\n`)
    );
};

cli.on(['-v', '--version'], showVersion);
cli.on(['-i', '--init'], initFpConfigFile);
cli.on(['-h', '--help'], printHelp);

var fpConfig = {};

global.fp = {
    root: path.join(process.cwd())
}

let beginFunc = function () {
    var questions = [{
            type: 'input',
            name: 'headTitle',
            message: 'input new page head title',
            default: function () {
                return '新页面';
            }
        },
        {
            type: 'input',
            name: 'headerTitle',
            message: 'input new page page header title',
            default: function () {
                return '新页面';
            }
        },
        {
            type: 'input',
            name: 'folderPath',
            message: 'input new page folder path',
            default: function () {
                return 'index';
            }
        },
        {
            type: 'input',
            name: 'name',
            message: 'input new page name',
            default: function () {
                return 'index';
            }
        }
    ];

    inquirer.prompt(questions).then(function (answers) {
        var an = extend(fpConfig, answers);
        require('./../main.js').initFunc(an);
    });
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
        beginFunc();
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