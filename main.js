let chalk = require('chalk');
let moment = require('moment');
let fs = require('fs');
let log = require('./lib/util/log');

let PATH_ENUM = {
    tpl: 'useTplPath',
    js: 'useJsPath',
    jsCom: 'useJsComPath'
};

let READ_WRITE_ENUM = {
    tpl: 'Tpl',
    js: 'Js',
    jsCom: 'JsCom'
};

let LOG_ENUM = {
    tpl: 'template',
    js: 'entry',
    jsCom: 'component'
};

let LIST = ['tpl', 'js', 'jsCom'];

var file = {};

let main = function (obj) {
    let __root = global.fp.root + '/';
    var mo = {
        baseTplPath: __root + obj.baseTplPath + '/',
        useTplPath: __root + obj.useTplPath + '/',
        useJsPath: __root + obj.useJsPath + '/',
        useJsComPath: __root + obj.useJsPath + '/',
        folderPath: obj.folderPath,
        tplFolderPath: obj.folderPath.split('/'),
        jsFolderPath: obj.folderPath.split('/'),
        jsComFolderPath: obj.folderPath.split('/'),
        headTitle: obj.headTitle,
        headerTitle: obj.headerTitle,
        name: obj.name
    };

    mo.jsComFolderPath.push('components');

    mo.readTplList = [`${mo.baseTplPath}index.ftl`];
    mo.readJsList = [`${mo.baseTplPath}entry.js`];
    mo.readJsComList = [`${mo.baseTplPath}index.js`, `${mo.baseTplPath}index.html`];

    mo.writeTplList = [`index.ftl`];
    mo.writeJsList = [`entry.js`];
    mo.writeJsComList = [`index.js`, `index.html`];

    let exists = function (pathFlag) {
        pathFlag = pathFlag || 'tpl';
        var flag = PATH_ENUM[pathFlag] || '';
        return new Promise((res, rej) => {
            (async function () {
                for (let layer of mo[pathFlag + 'FolderPath']) {
                    fs.existsSync(mo[flag] + layer) ? mo[flag] = mo[flag] + layer + '/' : await mkdir(layer, pathFlag);
                }
                res(mo[flag]);
            })()
        })
    }

    let mkdir = function (layer, pathFlag) {
        pathFlag = pathFlag || 'tpl';
        var flag = PATH_ENUM[pathFlag] || '';
        return new Promise((res, rej) => {
            fs.mkdir(mo[flag] + layer, (err) => {
                if (err) {
                    log.error(err);
                    rej(err);
                };
                mo[flag] = mo[flag] + layer + '/'
                res(mo[flag]);
            });
        })
    }

    let readFile = function (pathFlag) {
        pathFlag = pathFlag || 'tpl';
        // var flag = PATH_ENUM[pathFlag] || '';
        var key = 'read' + READ_WRITE_ENUM[pathFlag] + 'List';

        return new Promise((res) => {
            for (let layer of mo[key]) {
                let text = fs.readFileSync(layer).toString();
                var arr = layer.split('/');
                var k = arr[arr.length - 1].replace(/\./g, '');
                text = text.replace(/~date~/g, moment().format('YYYY-MM-DD'))
                    .replace(/~author~/g, '')
                    .replace(/~headTitle~/g, mo.headTitle)
                    .replace(/~headerTitle~/g, mo.headerTitle)
                    .replace(/~newJsPath~/g, mo.folderPath);

                file[k] = text;
            }
            res(file);
        })
    }

    let writeFile = function (file, pathFlag) {
        pathFlag = pathFlag || 'tpl';
        var flag = PATH_ENUM[pathFlag] || '';
        var key = 'write' + READ_WRITE_ENUM[pathFlag] + 'List';

        return new Promise((res, rej) => {
            (async function () {
                for (let layer of mo[key]) {
                    var k = layer.replace(/\./g, '');
                    await fs.writeFile(mo[flag] + '/' + layer,
                        file[k], (err) => {
                            if (err) rej(err)
                        })
                }
                res('succ');
            })()
        })
    }

    async function creatCpt() {
        for(let i of LIST) {
            try {
                await exists(i);
                await readFile(i);
                await writeFile(await readFile(i), i);
                log.ok(`successfully created ` + LOG_ENUM[i] + `files`);
                file = {};
            } catch (err) {
                log.error(err);
            }
        }
    }
    creatCpt();
}

exports.initFunc = function (obj) {
    main(obj);
};
