let chalk = require('chalk');
let moment = require('moment');
let fs = require('fs');
let log = require('./lib/util/log');

let main = function (obj) {
    var mo = {
        baseTplPath: global.fp.root + '/' + obj.baseTplPath + '/',
        useTplPath: global.fp.root + '/' + obj.useTplPath + '/',
        headTitle: obj.headTitle,
        headerTitle: obj.headerTitle,
        name: obj.name,
        folderPath: obj.folderPath.split('/')
    };

    mo.readList = [`${mo.baseTplPath}ftl.ftl`];
    mo.writeList = [`${mo.name}.ftl`];

    let file = [];

    let exists = function () {
        return new Promise((res, rej) => {
            (async function () {
                for (let layer of mo.folderPath) {
                    fs.existsSync(mo.baseTplPath + layer) ? mo.baseTplPath = `${mo.baseTplPath}${layer}/` : await mkdir(layer);
                }
                res(mo.baseTplPath);
            })()
        })
    }

    let mkdir = function (layer) {
        return new Promise((res, rej) => {
            fs.mkdir(mo.useTplPath + layer, (err) => {
                if (err) {
                    log.error(err);
                    rej(err);
                };
                mo.useTplPath = `${mo.useTplPath}${layer}/`
                res(mo.useTplPath);
            });
        })
    }

    let readFile = function () {
        return new Promise((res) => {
            for (let layer of mo.readList) {
                let text = fs.readFileSync(layer).toString();
                text = text.replace(/~date~/g, moment().format('YYYY/MM/DD HH:MM:SS'))
                    .replace(/~author~/g, '')
                    .replace(/~headTitle~/g, mo.headTitle)
                    .replace(/~headerTitle~/g, mo.headerTitle)
                    .replace(/~newJsPath~/g, mo.folderPath)
                    .replace(/~newJsName~/g, mo.name);

                file.push(text)
            }
            res(file);
        })
    }

    let writeFile = function (file) {
        return new Promise((res, rej) => {
            (async function () {
                for (let layer of mo.writeList) {
                    await fs.writeFile(`${mo.useTplPath}${layer}`,
                        layer == mo.writeList[3] ? file[0] : layer == mo.writeList[0] ? file[1] : '', (err) => {
                            if (err) rej(err)
                        })
                }
                res('succ');
            })()
        })
    }

    async function creatCpt() {
        try {
            await exists();
            await readFile();
            await writeFile(await readFile());
            return log.ok(`successfully created ${mo.name} component`)
        } catch (err) {
            log.error(err);
        }
    }
    creatCpt();
}

exports.initFunc = function (obj) {
    // log.info(obj.name);
    // log.warn(__dirname);
    main(obj);
};
