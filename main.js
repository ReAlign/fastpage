let chalk = require('chalk');
let moment = require('moment');
let fs = require('fs');
let log = require('./lib/util/log');

let main = function (obj) {
    let base_path = global.fp.root + '/' + obj.static_source_path + '/';
    let tpl_dir_path = global.fp.root + '/' + obj.tpl_dir_path + '/';
    let head_title = obj.head_title;
    let header_title = obj.header_title;
    let name = obj.name;
    let path = obj.full_path.split('/');
    let writes = [`${name}.ftl`];
    let reads = [`${base_path}ftl.ftl`];
    let file = [];

    let exists = function () {
        return new Promise((res, rej) => {
            (async function () {
                for (let a of path) {
                    fs.existsSync(base_path + a) ? base_path = `${base_path}${a}/` : await mkdir(a);
                }
                res(base_path);
            })()
        })
    }

    let mkdir = function (a) {
        return new Promise((res, rej) => {
            fs.mkdir(tpl_dir_path + a, (err) => {
                if (err) rej(err);
                tpl_dir_path = `${tpl_dir_path}${a}/`
                res(tpl_dir_path);
            });
        })
    }

    let readFile = function () {
        return new Promise((res) => {
            for (let a of reads) {
                let text = fs.readFileSync(a).toString();
                text = text.replace(/time/g, moment().format('YYYY/MM/DD'))
                    .replace(/~head_title~/g, head_title)
                    .replace(/~header_title~/g, header_title)
                    .replace(/~newJsPath~/g, path)
                    .replace(/~newJsName~/g, name)
                file.push(text)
            }
            res(file);
        })
    }

    let writeFile = function (file) {
        return new Promise((res, rej) => {
            (async function () {
                for (let a of writes) {
                    await fs.writeFile(`${tpl_dir_path}${a}`,
                        a == writes[3] ? file[0] : a == writes[0] ? file[1] : '', (err) => {
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
            return log.ok(`successfully created ${name} component`)
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
