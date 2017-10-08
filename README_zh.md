# fastpage

[英文说明](https://github.com/ReAlign/fastpage/blob/master/README.md)

[![NPM travis][travis-image]][github-url]
[![codebeat badge][codebeat-image]][codebeat-url]
[![NPM version][npm-image]][npm-url]
[![node version][node-v-image]][github-url]
[![download][downloads-image]][github-url]
[![licence][licence-image]][github-url]

[![NPM][nodei-image]][npm-url]

[github-url]: https://github.com/ReAlign/fastpage
[npm-url]: https://www.npmjs.com/package/fastpage
[codebeat-url]: https://codebeat.co/projects/github-com-realign-fastpage-master

[travis-image]: http://img.shields.io/travis/ReAlign/fastpage.svg

[codebeat-image]: https://codebeat.co/badges/6cedbb50-1d93-4b4a-bfe6-ec316b873667

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

## 简介

快速生成前端页面和相关文件的工具

* [x] 创建新页面时的大量重复工作
* [x] 支持多种页面（文件夹）类型，可配置
* [x] 内置替换规则，可扩展
* [ ] 其他（需求定制）

## 要求

* node version：≥v7.6.0

## 安装 & 运行

```
$ npm install fastpage -g
```

在项目根目录, 执行:

#### 初始化配置文件
```
$ fp -i
```
#### 创建主文件夹及相关文件
```
// 你可以直接执行 fp , 当然你也可以执行全命令: fp -r page(page 这个配置必须存在)
$ fp
```

#### 根据配置列表生成文件夹及相关文件
```
// modal 是配置列表中存在的配置
$ fp -r modal
```

## 配置

`fastpage.config.js` 示例:

```javascript
var config = {
    page: {
        tempPath: 'template',            // 模板文件夹路径
        list: [
            {
                key: 'ftl',              // 文件 key
                path: 'view',
                tempPath: ['index.ftl'], // 相对于模板文件夹的路径
                name: ['index.ftl']      // 待生成文件的名字
            },
            {
                key: 'js',
                path: 'src/page',
                tempPath: ['entry.js'],
                name: ['entry.js']
            }
        ],
        // 通常每个一级目录使用一个 mcss 样式文件
        // 当然你也可以给每个页面均配置一个 mcss
        mcssTopLevel: true,
        // fastpage 内置了一些替换规则
        // 你可以定制自己的替换规则
        replaceList: [
            {
                rex: '~value~',      // 带替换字符串 / 正则表达式
                global: true,        // 是不是全局替换
                str: 'replace value' // 替换之后的字符串
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

# 命令

```
-v, --version,   输出版本
-i, --init,      创建 fastpage.config.js 配置文件
-r, --run,       创建页面文件夹及相关文件
-h, --help,      帮助
```


