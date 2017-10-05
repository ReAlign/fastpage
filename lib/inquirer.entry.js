'use strict';

let inquirer = require('inquirer');
let extend = require('node.extend');
let log = require('./util/log');

let inqu = {
    trimPath: function(str) {
        return str.replace(/^\/*|\/*$/g,'');
    },
    run: function (fpConfig) {
        var self = this;
        let judgeConfig = function (fpConfig) {
            for (let key in fpConfig) {
                if (fpConfig.hasOwnProperty(key)) {
                    if (fpConfig[key]) {
                        fpConfig[key] = self.trimPath(fpConfig[key])
                    } else {
                        return false;
                    }
                }
            }

            return true;
        };

        if (!judgeConfig(fpConfig)) {
            log.error('the configuration data is incomplete');
            return false;
        }

        this.init(fpConfig);
    },
    init: function (fpConfig) {
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