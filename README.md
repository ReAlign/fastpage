# fastpage
[中文说明](https://github.com/ReAlign/fastpage/blob/master/README_zh.md)
## Introduction

A tool to quickly generate front-end pages and associated files

* [x] a lot of repetitive work is done when creating a new page
* [x] support multiple page (folder) types, configurable
* [x] built-in replacement rules, can be extended
* [ ] other (requirements customization)

## Install & run

```
$ npm install fastpage -g
```

At project root directory, and run:

#### init config file
```
$ fp -i
```
#### create main page folder and associated files
```
// just fp , also you can run: fp -r page(page config list must exist)
$ fp
```

#### create page with config list
```
// is the configuration that exists in the configuration list
$ fp -r modal
```

## Configuration

`fastpage.config.js` sample:

```javascript
var config = {
    page: {
        tempPath: 'template',            // all template folder path
        list: [
            {
                key: 'ftl',              // file key
                path: 'view',
                tempPath: ['index.ftl'], // relative to page.tempPath
                name: ['index.ftl']      // generate file name
            },
            {
                key: 'js',
                path: 'src/page',
                tempPath: ['entry.js'],
                name: ['entry.js']
            }
        ],
        // usually a level one menu has a mcss
        // also you can create one mcss per page
        mcssTopLevel: true,
        // fastpage built-in some replacement rules
        // you can customize your own replacement rules
        replaceList: [
            {
                rex: '~value~',      // strings to be replaced (regular expressions)
                global: true,        // global flag
                str: 'replace value' // string to replace
            }
        ]
    },
    modal: {
        tempPath: '/webapp/s_tpl/modal',
        list: [
            {
                key: 'jsCom',
                path: 'webapp/src/page',
                path2: 'components/modal',
                tempPath: ['index.js', 'index.html'],
                name: ['index.js', 'index.html']
            }
        ],
        mcssTopLevel: false,
        replaceList: []
    }
};

module.exports = config;
```

# cli

```
-v, --version,   print version
-i, --init,      create fastpage.config.js
-r, --run,       create page folder and associated files
-h, --help,      print help
```


