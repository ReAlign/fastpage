let fs = require('fs');
let log = require('n-s-logs');
let moment = require('moment');
let tool = require('./util/tool');
let exec = require('child_process').exec;

let file = {};

let main = (fpConfig, conf) => {
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
    let _keysPath = {},   // path about
        _replaceArr = {};

    _keysPath = tool.initPrivKeysPath(_keys, conf, _folderPathArr, _answers);
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
                let arr = {};
                let strArr = stdout.toString().split('\n');
                strArr.forEach((item) => {
                    let i = item.indexOf('=');
                    let _arr = [item.substring(0, i), item.substring(i + 1)];
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
                    const _file = `${_cachePath[flag]}${layer}`;

                    fs.existsSync(_file)
                        ? _cachePath[flag] = `${_file}/`
                        : await mkdir(layer, flag);
                }
                res(_cachePath[flag]);
            })()
        })
    }

    let mkdir = (layer, flag) => {
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
        })
    }

    let replaceAll = (flag, replaceList = [], info) => {
        for (let layer of _tempConf[flag]) {
            let text = fs.readFileSync(layer).toString();
            let arr = layer.split('/');
            let k = arr[arr.length - 1].replace(/\./g, '');
            text = text.replace(/~date~/g, moment().format('YYYY-MM-DD'))
                        .replace(/~author~/g, (info['user.name'] || '') + '(' + (info['user.email'] || '') + ')')
                        .replace(/~headTitle~/g, _replaceArr.headTitle)
                        .replace(/~headerTitle~/g, _replaceArr.headerTitle)
                        .replace(/~newTopPath~/g, _keysPath.mcss.join('/'))
                        .replace(/~newJsPath~/g, _replaceArr.folderPath);


            if(replaceList.length) {
                replaceList.every(function(item) {
                    let global = item.global ? 'g' : '';
                    let rex = new RegExp(item.rex, global);
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
            })()
        })
    }

    let creatCpt = async () => {
        for(let i of _keys) {
            try {
                await exists(i.key);
                await readFile(i.key);
                await writeFile(await readFile(i.key), i.key);
                log.ok(`successfully created ${i.key} directory and associated files`);
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


