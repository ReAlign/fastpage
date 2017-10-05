'use strict';

let inquirer = require('inquirer');
let extend = require('node.extend');

let inqu = {
    run: function (fpConfig) {
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
            require('./../lib/main').init(an);
        });
    }
}

module.exports = inqu;