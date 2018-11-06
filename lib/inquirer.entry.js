'use strict';

const inquirer = require('inquirer');
const log = require('n-s-logs');
const path = require('path');
const fs = require('fs');
const tool = require('./util/tool');

const _root = global.fp.root;

const inqu = {
    defQuesDesc: [
        {
            name: 'headTitle',
            message: 'input new page head title',
            placeholder: '新页面'
        },
        {
            name: 'headerTitle',
            message: 'input new page page header title',
            placeholder: '新页面'
        },
        {
            name: 'folderPath',
            message: 'input new page folder path',
            placeholder: 'index'
        },
        {
            name: 'name',
            message: 'input new page name',
            placeholder: 'index'
        }
    ],

    // 生成问题 itrm
    quesDescItem(opt = {}) {
        const {
            name = '',
            message = '',
            placeholder = ''
        } = opt;

        return {
            type: 'input',
            name,
            message,
            default: () => placeholder
        };
    },

    // 组合问题 item 生成 问题整体
    factoryQues(questions = []) {
        let _arr = [];

        questions.forEach((item) => {
            _arr.push(this.quesDescItem(item));
        });

        return _arr;
    },

    init(fpConfig = {}) {
        const _struComplete = this.checkStructure(fpConfig);
        const _extraQues = this.collectExtraDynamicQuesDesc(this.filterDynamicQues(fpConfig));

        if(_struComplete && _extraQues) {
            this.inquirer(fpConfig, _extraQues);
        }
    },

    checkStructure(fpConfig = {}) {
        let flag = false;
        const pConf = fpConfig.list || [];
        const logErrorAndExit = (path) => {
            log.error(`directory '${path}' does't exist. Please run ' fp -c _pageKey_' to create directory.`);
            return false;
        };

        // 检查结构是否完整
        flag = pConf.every((item) => {
            const directoryPath = path.join(_root, tool.trimPath(item.path));
            const _flag = fs.existsSync(directoryPath);
            if(!_flag) {
                logErrorAndExit(directoryPath);
            }

            return _flag;
        });

        return flag;
    },

    filterDynamicQues(fpConfig = {}) {
        return (fpConfig.replaceList || []).filter((item) => item.dynamic);
    },

    collectExtraDynamicQuesDesc(_extraDynamicQues = []) {
        let _arr = [];

        _extraDynamicQues.forEach((item) => {
            _arr.push({
                name: item.rex,
                message: `input ${item.rex}`,
                placeholder: `${item.str}`
            });
        });

        return _arr;
    },

    updateFpConfigReplaceList(fpConfig = {}, extraAnswers = {}) {
        const rList = fpConfig.replaceList || [];

        Object.keys(extraAnswers).forEach((item) => {
            rList.forEach((that) => {
                if(that.dynamic && that.rex === item) {
                    that.str = extraAnswers[item];
                }
            });
        });
    },

    inquirer(fpConfig = {}, extraQues = []) {
        const defQues = this.factoryQues(this.defQuesDesc);
        const ques = this.factoryQues(extraQues);

        inquirer.prompt(defQues).then((answers) => {
            if(ques && ques.length) {
                inquirer.prompt(ques).then((extraAnswers) => {
                    inqu.updateFpConfigReplaceList(fpConfig, extraAnswers);
                    inqu.update(fpConfig, answers);
                });
            } else {
                inqu.update(fpConfig, answers);
            }
        });
    },

    collectMainData(fpConfig = {}, answers) {
        const pConf = fpConfig.list || [];
        const tempPath = fpConfig.tempPath || '';
        let flag = true;
        let pageConf = {};
        let tempConf = {};
        let names = {};

        if(!tempPath) {
            flag = false;
        }

        if(flag) {
            // page
            pConf.every((item) => {
                if(!item.key || !item.path) {
                    flag = false;
                } else {
                    // 拼接绝对路径
                    pageConf[item.key] = `${_root}/${tool.trimPath(item.path)}/`;
                    const tempArr = [];
                    // 遍历模板路径，拼接成绝对路径
                    item.tempPath.every((item) => {
                        tempArr.push(`${_root}/${tool.trimPath(tempPath)}/${item}`);
                        return true;
                    });
                    tempConf[item.key] = tempArr;
                    names[item.key] = item.name;
                }

                return flag;
            });
        }

        const obj = {
            answers,
            pageConf,
            tempConf,
            names,
            mcssTopLevel: fpConfig.mcssTopLevel
        };

        return flag ? obj : null;
    },

    update(fpConfig = {}, answers) {
        const _obj = this.collectMainData(fpConfig, answers);

        if(!_obj) {
            log.error('the configuration data is incomplete');
            return false;
        }

        require('./../lib/main').init(fpConfig, _obj);
    }
};

module.exports = inqu;