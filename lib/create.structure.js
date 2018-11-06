'use strict';

const fs = require('fs');
const log = require('n-s-logs');
const tool = require('./util/tool');

let cs = {
    init(fpObj) {
        let _r = `${global.fp.root}/`;
        let pConf = fpObj.list || [];
        let pageConf = {};
        let keyList = [];
        let rootMap = {};
        let wrongFlag = true;

        pConf.every((item) => {
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

        const u = {};

        u.judgeCreate = async(key) => {
            for (let layer of pageConf[key]) {
                const _dir = `${rootMap[key]}${layer}`;
                const _flag = fs.existsSync(_dir);

                if(_flag) {
                    log.warn(`already exists: ${_dir}`);
                    rootMap[key] = `${_dir}/`;
                } else {
                    await u.mkdir(layer, key);
                }
            }
        };

        u.mkdir = (layer, key) => {
            key = key || '';
            return new Promise((res, rej) => {
                fs.mkdir(rootMap[key] + layer, (err) => {
                    if (err) {
                        log.error(err);
                        rej(err);
                    }
                    rootMap[key] = `${rootMap[key]}${layer}/`;
                    res(rootMap[key]);
                });
            });
        };

        u.creatCpt = async() => {
            for(let k of keyList) {
                try {
                    await u.judgeCreate(k);
                } catch (err) {
                    log.error(err);
                }
            }

            log.ok('successfully created directorys');
        };

        u.creatCpt();

        return false;
    }
};

module.exports = cs;