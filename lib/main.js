let fs = require('fs');
let chalk = require('chalk');
let moment = require('moment');
let log = require('./util/log');
let util = require('./util/util');
let extend = require('node.extend');
var exec = require('child_process').exec;

let PATH_ENUM = {
    tpl: 'useTplPath',
    mcss: 'useMcssPath',
    js: 'useJsPath',
    jsCom: 'useJsComPath'
};

let READ_WRITE_ENUM = {
    tpl: 'Tpl',
    mcss: 'Mcss',
    js: 'Js',
    jsCom: 'JsCom'
};

var file = {};

let main = (fpConfig, conf) => {
    /**
     * fpConfig
     *  conf
     *      answers
     *      pageConf
     *      keys
     *      mcssTopLevel
     */

    let _root = global.fp.root + '/';
    var _keys = fpConfig.page;
    var _cachePath = conf.pageConf;
    var _answers = conf.answers;
    var _folderPath = _answers.folderPath;
    var _tempConf = conf.tempConf;
    var _names = conf.names;
    var _folderPathArr = _folderPath.split('/');
    var _keysPath = {}, _replaceArr = {};

    _keys.every(function(item) {
        if(item.key == 'mcss' && conf.mcssTopLevel) {
            _keysPath[item.key] = _folderPathArr.slice(0, 1);
        } else {
            _keysPath[item.key] = _folderPathArr;
            if(item.path2) {
                _keysPath[item.key] = _folderPathArr.concat(item.path2.split('/'));
            }
        }

        return true;
    });

    for(let k in _answers) {
        if (_answers.hasOwnProperty(k) && _answers[k] != 'folderPath'){
            _replaceArr[k] = _answers[k];
        }
    }

    let getUserInfo = (fn) => {
        exec('git config --list', (err, stdout, stderr) => {
            if (err) {
                log.error(err);
            }

            let showIt = (stdout) => {
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

            fn(showIt(stdout));
        });
    };

    let exists = (flag) => {
        return new Promise((res, rej) => {
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
                };
                _cachePath[flag] = _cachePath[flag] + layer + '/'
                res(_cachePath[flag]);
            });
        })
    }

    let replaceAll = (flag, info) => {
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

            file[k] = text;
        }
    };

    let readFile = (flag) => {
        return new Promise((res) => {
            getUserInfo((obj) => {
                replaceAll(flag, obj);
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
                log.ok(`successfully created ` + i.key + `files`);
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


