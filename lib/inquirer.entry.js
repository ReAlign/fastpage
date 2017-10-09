'use strict';

let inquirer = require('inquirer');
let log = require('./util/log');

let inqu = {
    trimPath: function(str) {
        return str.replace(/^\/*|\/*$/g,'');
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
            inqu.update(fpConfig, answers);
        });
    },
    update: function (fpConfig, answers) {
        let _r = global.fp.root;

        let judgeConfig = function (fpConfig = []) {
            var flag = true,
                pConf = fpConfig.list || [],
                tempPath = fpConfig.tempPath || '',
                pageConf = {},
                tempConf = {},
                names = {};

            if(!tempPath) {
                flag = false;
            }
            if(flag) {
                // page
                pConf.every(function(item) {
                    if(!item.key || !item.path) {
                        flag = false;
                    } else {
                        // 拼接绝对路径
                        pageConf[item.key] = _r + '/' + inqu.trimPath(item.path) + '/';
                        var tempArr = [];
                        // 遍历模板路径，拼接成绝对路径
                        item.tempPath.every(function(item) {
                            tempArr.push(_r + '/' + inqu.trimPath(tempPath) + '/' + item);
                            return true;
                        });
                        tempConf[item.key] = tempArr;
                        names[item.key] = item.name;
                    }

                    return flag;
                });
            }

            var obj = {
                answers: answers,
                pageConf: pageConf,
                tempConf: tempConf,
                names: names,
                mcssTopLevel: fpConfig.mcssTopLevel
            };

            return flag ? obj : flag;
        };

        if (judgeConfig(fpConfig)) {
            require('./../lib/main').init(fpConfig, judgeConfig(fpConfig));
        } else {
            log.error('the configuration data is incomplete');
            return false;
        }
    }
}

module.exports = inqu;