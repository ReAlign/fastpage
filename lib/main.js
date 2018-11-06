const fs = require('fs');
const log = require('n-s-logs');
const moment = require('moment');
const tool = require('./util/tool');
const exec = require('child_process').exec;

let file = {};

const main = (fpConfig, conf) => {
    // config list
    let _keys = fpConfig.list;
    // page file absolute path
    let _cachePath = conf.pageConf;
    // inquirer answers, about name & path
    let _answers = conf.answers;
    // folder path [arr]
    let _folderPath = _answers.folderPath;
    // page template config
    let _tempConf = conf.tempConf;
    // template names
    let _names = conf.names;
    // folder path [str]
    let _folderPathArr = _folderPath.split('/');
    let _keysPath = {}; // path about
    let _replaceArr = {};

    const u = {};

    u.getUserInfo = (callback) => {
        exec('git config --list', (err, stdout, stderr) => {
            if (err) {
                log.error(err);
            }
            const showIt = (stdout, stderr) => {
                if (stderr) {
                    log.error(stderr);
                }
                let arr = {};
                let strArr = stdout.toString().split('\n');
                strArr.forEach((item) => {
                    let i = item.indexOf('=');
                    let _arr = [item.substring(0, i), item.substring(i + 1)];
                    if(arr[_arr[0]]) {
                        arr[`${_arr[0]}.pro`] = arr[_arr[0]];
                        arr[_arr[0]] = _arr[1];
                    } else {
                        arr[_arr[0]] = _arr[1];
                    }
                });
                return arr;
            };
            callback(showIt(stdout, stderr));
        });
    };

    u.exists = (flag) => {
        flag = flag || false;

        return new Promise((res) => {
            (async() => {
                for (let layer of _keysPath[flag]) {
                    const _file = `${_cachePath[flag]}${layer}`;

                    fs.existsSync(_file)
                        ? _cachePath[flag] = `${_file}/`
                        : await u.mkdir(layer, flag);
                }
                res(_cachePath[flag]);
            })();
        });
    };

    u.mkdir = (layer, flag) => {
        flag = flag || false;
        return new Promise((res, rej) => {
            const _file = `${_cachePath[flag]}${layer}`;
            fs.mkdir(_file, (err) => {
                if (err) {
                    log.error(err);
                    rej(err);
                }
                _cachePath[flag] = `${_file}/`;
                res(_cachePath[flag]);
            });
        });
    };

    u.replaceAll = (flag, replaceList = [], info) => {
        for (let layer of _tempConf[flag]) {
            let text = fs.readFileSync(layer).toString();
            let arr = layer.split('/');
            let k = arr[arr.length - 1].replace(/\./g, '');
            text = text
                .replace(/~date~/g, moment().format('YYYY-MM-DD'))
                .replace(/~author~/g, `${info['user.name'] || ''}(${info['user.email'] || ''})`)
                .replace(/~headTitle~/g, _replaceArr.headTitle)
                .replace(/~headerTitle~/g, _replaceArr.headerTitle)
                .replace(/~newTopPath~/g, _keysPath.mcss.join('/'))
                .replace(/~newJsPath~/g, _replaceArr.folderPath);

            if(replaceList.length) {
                replaceList.every((item) => {
                    let global = item.global ? 'g' : '';
                    let rex = new RegExp(item.rex, global);
                    text = text.replace(rex, item.str);

                    return true;
                });
            }
            file[k] = text;
        }
    };

    u.readFile = (flag) => {
        flag = flag || false;
        return new Promise((res) => {
            u.getUserInfo((func) => {
                u.replaceAll(flag, fpConfig.replaceList || [], func);
                res(file);
            });
        });
    };

    u.writeFile = (file, flag) => {
        flag = flag || false;
        return new Promise((res, rej) => {
            (async() => {
                for (let layer of _names[flag]) {
                    const _k = layer.replace(/\./g, '');
                    const _file = `${_cachePath[flag]}${layer}`;
                    const _exists = fs.existsSync(_file);

                    if(_exists) {
                        log.warn(`already exists: ${_file}`);
                    } else {
                        await fs.writeFile(_file, file[_k], (err) => {
                            if(err) {
                                rej(err);
                            }
                        });
                    }
                }
                res('succ');
            })();
        });
    };

    u.creatCpt = async() => {
        for(let i of _keys) {
            try {
                await u.exists(i.key);
                await u.readFile(i.key);
                await u.writeFile(await u.readFile(i.key), i.key);
                log.ok(`successfully created ${i.key} directory and associated files`);
                file = {};
            } catch (err) {
                log.error(err);
            }
        }
    };

    _keysPath = tool.initPrivKeysPath(_keys, conf, _folderPathArr, _answers);
    _replaceArr = tool.initPrivReplaceArr(_answers);

    u.creatCpt();
};

exports.init = (fpConfig, conf) => {
    main(fpConfig, conf);
};