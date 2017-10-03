#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
let inquirer = require('inquirer');
let chalk = require('chalk');
let extend = require('node.extend');
let log = require('./../lib/util/log');

var fpConfig = {};

let beginFunc = function() {
    var questions = [
        {
            type: 'input',
            name: 'head_title',
            message: 'input new page head title',
            default: function () {
                return '新页面';
            }
        },
        {
            type: 'input',
            name: 'header_title',
            message: 'input new page page header title',
            default: function () {
                return '新页面';
            }
        },
        {
            type: 'input',
            name: 'full_path',
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
        log.ok(JSON.stringify(answers, null, '  '));
        var an = extend(fpConfig, answers);
        log.info(JSON.stringify(an, null, '  '));
        require('./../main.js').initFunc(an);
    });
}

let readyConfig = function() {
    let root = path.join(process.cwd());
    
    global.fp = {
        root: root,
        dev: {},
    }
    
    let fpConfigPath = path.join(__dirname, 'fastpage.config.js');

    if( !isFileExist(fpConfigPath) ) {
        log.error('Can\'t find fastpage.config.js, please make sure the file exists.');
        return false;
    }

    try{
        fpConfig = require(fpConfigPath);
        log.ok('ok');
        log.info(fpConfig);
        beginFunc();
    } catch(e) {
        log.error('Fail reading fastpage.config.js, please check your file.');
        return false;
    }
    return true;
}

function isFileExist(path) {
    try {
        return fs.existsSync(path);
    } catch (e) {
        return false;
    }
}

readyConfig();
