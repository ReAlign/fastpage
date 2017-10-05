'use strict';

let chalk = require('chalk');

let log = {
    ok: function(str) {
        console.log(chalk.bold.green('✔ \t' + str));
    },
    error: function(str) {
        console.log(chalk.bold.red('✘ \t' + str));
    },
    warn: function(str) {
        console.log(chalk.yellow('⚠️ \t' + str));
    },
    info: function(str) {
        console.log(chalk.blue('✏️ \t' + str));
    },
    show: function(str, logo) {
        logo = logo || '';
        if(logo) {
            str = logo + ' \t' + str;
        }
        console.log(str);
    }
};

module.exports = log;