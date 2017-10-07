let fs = require('fs');
// let chalk = require('chalk');
let moment = require('moment');
let log = require('./util/log');
// let util = require('./util/util');
let tool = require('./util/tool');
// let extend = require('node.extend');
let exec = require('child_process').exec;

var file = {};

let main = (fpConfig, conf) => {
    // root
    // let _root = global.fp.root + '/';
    // config list
    var _keys = fpConfig.list;
    // page file absolute path
    var _cachePath = conf.pageConf;
    // inquirer answers, about name & path
    var _answers = conf.answers;
    // folder path [arr]
    var _folderPath = _answers.folderPath;
    // page template config
    var _tempConf = conf.tempConf;
    // template names
    var _names = conf.names;
    // folder path [str]
    var _folderPathArr = _folderPath.split('/');
    var _keysPath = {},   // path about
        _replaceArr = {};

    _keysPath = tool.initPrivKeysPath(_keys, conf, _folderPathArr);
    _replaceArr = tool.initPrivReplaceArr(_answers);

    let getUserInfo = (callback) => {
        exec('git config --list', (err, stdout, stderr) => {
            if (err) {
                log.error(err);
            }
            let showIt = (stdout, stderr) => {
                if (stderr) {
                    log.error(stderr);
                }
                var arr = {};
                var strArr = stdout.toString().split('\n');
                strArr.forEach((item) => {
                    var i = item.indexOf('=');
                    var _arr = [item.substring(0, i), item.substring(i + 1)];
                    if(arr[_arr[0]]) {
                        arr[_arr[0] + '.pro'] = arr[_arr[0]];
                        arr[_arr[0]] = _arr[1];
                    } else {
                        arr[_arr[0]] = _arr[1];
                    }
                });
                return arr;
            }
            callback(showIt(stdout, stderr));
        });
    };

    let exists = (flag) => {
        return new Promise((res) => {
            (async function () {
                for (let layer of _keysPath[flag]) {
                    fs.existsSync(_cachePath[flag] + layer) ? _cachePath[flag] = _cachePath[flag] + layer + '/' : await mkdir(layer, flag);
                }
                res(_cachePath[flag]);
            })()
        })
    }

    let mkdir = (layer, flag) => {
        return new Promise((res, rej) => {
            fs.mkdir(_cachePath[flag] + layer, (err) => {
                if (err) {
                    log.error(err);
                    rej(err);
                }
                _cachePath[flag] = _cachePath[flag] + layer + '/'
                res(_cachePath[flag]);
            });
        })
    }

    let replaceAll = (flag, replaceList = [], info) => {
        for (let layer of _tempConf[flag]) {
            let text = fs.readFileSync(layer).toString();
            var arr = layer.split('/');
            var k = arr[arr.length - 1].replace(/\./g, '');
            text = text.replace(/~date~/g, moment().format('YYYY-MM-DD'))
                        .replace(/~author~/g, (info['user.name'] || '') + '(' + (info['user.email'] || '') + ')')
                        .replace(/~headTitle~/g, _replaceArr.headTitle)
                        .replace(/~headerTitle~/g, _replaceArr.headerTitle)
                        .replace(/~newTopPath~/g, _keysPath.mcss.join('/'))
                        .replace(/~newJsPath~/g, _replaceArr.folderPath);


            if(replaceList.length) {
                replaceList.every(function(item) {
                    var global = item.global ? 'g' : '';
                    var rex = new RegExp(item.rex, global);
                    text = text.replace(rex, item.str);

                    return true;
                });
            }
            file[k] = text;
        }
    };

    let readFile = (flag) => {
        return new Promise((res) => {
            getUserInfo((func) => {
                replaceAll(flag, fpConfig.replaceList || [], func);
                res(file);
            })
        })
    }

    let writeFile = (file, flag) => {
        return new Promise((res, rej) => {
            (async () => {
                for (let layer of _names[flag]) {
                    var k = layer.replace(/\./g, '');
                    await fs.writeFile(_cachePath[flag] + '/' + layer,
                        file[k], (err) => {
                            if (err) rej(err)
                        })
                }
                res('succ');
            })()
        })
    }

    let creatCpt = async () => {
        for(let i of _keys) {
            try {
                await exists(i.key);
                await readFile(i.key);
                await writeFile(await readFile(i.key), i.key);
                log.ok('successfully created ' + i.key + 'files');
                file = {};
            } catch (err) {
                log.error(err);
            }
        }
    }
    creatCpt();
}

exports.init = (fpConfig, conf) => {
    main(fpConfig, conf);
};


