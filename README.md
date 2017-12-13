# fastpage

[中文说明](https://github.com/ReAlign/fastpage/blob/master/README_zh.md)

[![NPM travis][travis-image]][github-url]
[![codebeat badge][codebeat-image]][codebeat-url]
[![codecov][codecov-image]][codecov-url]
[![NPM version][npm-image]][npm-url]
[![node version][node-v-image]][github-url]
[![download][downloads-image]][github-url]
[![licence][licence-image]][github-url]

[![NPM][nodei-image]][npm-url]

[github-url]: https://github.com/ReAlign/fastpage
[npm-url]: https://www.npmjs.com/package/fastpage
[codebeat-url]: https://codebeat.co/projects/github-com-realign-fastpage-master
[codecov-url]: https://codecov.io/gh/ReAlign/fastpage

[travis-image]: http://img.shields.io/travis/ReAlign/fastpage.svg

[codebeat-image]: https://codebeat.co/badges/6cedbb50-1d93-4b4a-bfe6-ec316b873667
[codecov-image]: https://codecov.io/gh/ReAlign/fastpage/branch/master/graph/badge.svg

[npm-image]: https://img.shields.io/npm/v/fastpage.svg

[node-v-image]: https://img.shields.io/badge/node-%E2%89%A5v7.6.0-brightgreen.svg

[downloads-image]: https://img.shields.io/npm/dt/fastpage.svg

[licence-image]: https://img.shields.io/npm/l/fastpage.svg

[nodei-image]: https://nodei.co/npm/fastpage.png?downloads=true&downloadRank=true&stars=true

<!-- [![NPM stars][stars-image]][stars-url]
[![NPM forks][forks-image]][forks-url]
[![NPM issues][issues-image]][issues-url] -->

<!-- [stars-image]: https://img.shields.io/github/stars/ReAlign/fastpage.svg
[stars-url]: https://github.com/ReAlign/fastpage/stargazers -->

<!-- [forks-image]: https://img.shields.io/github/forks/ReAlign/fastpage.svg
[forks-url]: https://github.com/ReAlign/fastpage/network -->

<!-- [issues-image]: https://img.shields.io/github/issues/ReAlign/fastpage.svg
[issues-url]: https://github.com/ReAlign/fastpage/issues -->

## Condition

* node version：≥v7.6.0

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

#### need to pay attention to the input name

```javascript
$ input new page name (index): a/entry
```
* this place will be as follows:
    * when path2 already exist, `path a` will be spell into the path, but will not change file name, the name of configuration shall prevail（the follow-up to optimize）

## Configuration

`fastpage.config.js` sample:

```javascript
var config = {
    page: {
        tempPath: 'template',            // The template folder path, relative to the configuration file
        list: [
            {
                key: 'ftl',              // file key
                path: 'view',            // This file generates the path relative to the configuration file
                tempPath: ['index.ftl'], //The file template path relative to the template folder path
                name: ['index.ftl']      // For the name of the generated file, tempPath & name has multiple
                                         // and the array location needs to correspond
            },
            {
                key: 'mcss',
                path: 'mcss',
                tempPath: ['main.mcss'],
                name: ['main.mcss']
            },
            {
                key: 'js',
                path: 'javascript',
                tempPath: ['entry.js'],
                name: ['entry.js']
            },
            {
                key: 'jsCom',
                path: 'javascript',
                path2: 'components',     // some file paths depend on newly created folder 'folder'
                                         // and path2 is spliced in the back of 'folder'
                tempPath: ['components/index.js', 'components/config.js', 'components/index.html'],
                name: ['index.js', 'config.js', 'index.html']
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
-c, --create     create the structure as configured
-r, --run,       create page folder and associated files
-h, --help,      print help
```


