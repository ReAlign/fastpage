'use strict';

const fs = require('fs');
const log = require('n-s-logs');
const tool = require('./util/tool');

let cs = {
    init: function (fpObj) {
        let _r = global.fp.root + '/';
        let pConf = fpObj.list || [];
        let pageConf = {};
        let keyList = [];
        let rootMap = {};
        let wrongFlag = true;

        pConf.every(function(item) {
            if(!item.key || !item.path) {
                if(wrongFlag) {
                    log.error('config info is wrong. Please check it!');
                    wrongFlag = false;
                }
            } else {
                keyList.push(item.key);
                rootMap[item.key] = _r;
                pageConf[item.key] = tool.trimPath(item.path).split('/');
            }

            return wrongFlag;
        });

        let judgeCreate = async (key) => {
            for (let layer of pageConf[key]) {
                const _dir = `${rootMap[key]}${layer}`;
                const _flag = fs.existsSync(_dir);

                if(_flag) {
                    log.warn(`already exists: ${_dir}`);
                    rootMap[key] = `${_dir}/`;
                } else {
                    await mkdir(layer, key);
                }
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
    }
}

module.exports = cs;