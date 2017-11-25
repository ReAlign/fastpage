'use strict';

let fs = require('fs');
let log = require('n-s-logs');

let cs = {
    trimPath: function(str) {
        return str.replace(/^\/*|\/*$/g,'');
    },
    init: function (fpObj) {
        let _r = global.fp.root + '/';
        var pConf = fpObj.list || [];
        var pageConf = {};
        var keyList = [];
        var rootMap = {};
        var wrongFlag = true;

        pConf.every(function(item) {
            if(!item.key || !item.path) {
                if(wrongFlag) {
                    log.error('config info is wrong. Please check it!');
                    wrongFlag = false;
                }
            } else {
                keyList.push(item.key);
                rootMap[item.key] = _r;
                pageConf[item.key] = cs.trimPath(item.path).split('/');
            }

            return wrongFlag;
        });

        let judgeCreate = async (key) => {
            for (let layer of pageConf[key]) {
                fs.existsSync(rootMap[key] + layer) ? rootMap[key] = rootMap[key] + layer + '/' : await mkdir(layer, key);
            }
        };

        let mkdir = (layer, key) => {
            return new Promise((res, rej) => {
                fs.mkdir(rootMap[key] + layer, (err) => {
                    if (err) {
                        log.error(err);
                        rej(err);
                    }
                    rootMap[key] = rootMap[key] + layer + '/'
                    res(rootMap[key]);
                });
            })
        }

        let creatCpt = async () => {
            for(let k of keyList) {
                try {
                    await judgeCreate(k);
                } catch (err) {
                    log.error(err);
                }
            }

            log.ok('successfully created directorys');
        }

        creatCpt();

        return false;

        // fs.existsSync(_cachePath[flag] + layer) ? _cachePath[flag] = _cachePath[flag] + layer + '/' : await tool.mkdir(layer, _cachePath[flag]);

    }
}

module.exports = cs;