# fastpage

[英文说明](https://github.com/ReAlign/fastpage/blob/master/README_en.md)

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

## 要求

* node version：≥v7.6.0

## 简介

快速生成前端页面和相关文件的工具

* [x] 创建新页面时的大量重复工作
* [x] 根据配置生成文件夹结构
* [x] 支持多种页面（文件夹）类型，可配置
* [x] 内置替换规则，可扩展
* [x] 动态替换规则，实时输入命令时动态替换
* [ ] 其他（需求定制）

## 安装 & 运行

```bash
// global install
$ npm install fastpage -g
```

在项目根目录, 执行:

### 初始化配置文件

```bash
// init
$ fp -i
```

### 创建主文件夹及相关文件

```bash
// 你可以直接执行 fp , 当然你也可以执行全命令: fp -r page(page 这个配置必须存在)
$ fp
```

### 根据配置列表生成文件夹及相关文件

```bash
// modal 是配置列表中存在的配置
$ fp -r modal
```

### 最后输入名称需要注意

```bash
// index
$ input new page name (index): a/entry
```

* 这个地方会进行如下处理：
  * 有 path2 的时候， `路径a` 会被拼进路径中，但是文件名称不会变，以配置中的名称为准（后续会优化）

## 配置

`fastpage.config.js` 示例:

```javascript
const config = {
    page: {
        tempPath: 'template',            // 模板文件夹路径，相对于配置文件
        list: [
            {
                key: 'ftl',              // 文件 key
                path: 'view',            // 该文件生成路径，相对于配置文件
                tempPath: ['index.ftl'], // 该文件模板路径，相对于模板文件夹的路径
                name: ['index.ftl']      // 待生成文件的名字，tempPath & name 有多个的话，数组位置需对应
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
                path2: 'components',     // 有些文件的路径是依赖新建的文件夹folder的，path2会拼接在folder后面
                tempPath: ['components/index.js', 'components/config.js', 'components/index.html'],
                name: ['index.js', 'config.js', 'index.html']
            }
        ],
        // 通常每个一级目录使用一个 mcss 样式文件
        // 当然你也可以给每个页面均配置一个 mcss
        mcssTopLevel: true,
        // fastpage 内置了一些替换规则
        // 你可以定制自己的替换规则
        replaceList: [
            {
                dynamic: true,       // 是否在输入命令时动态替换
                rex: '~value~',      // 带替换字符串 / 正则表达式
                global: true,        // 是不是全局替换
                str: 'replace value' // 替换之后的字符串：dynamic=true 时 是建议值
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

## 命令

```javascript
-v, --version,   输出版本
-i, --init,      创建 fastpage.config.js 配置文件
-c, --create,    根据配置创建目录结构
-r, --run,       创建页面文件夹及相关文件
-h, --help,      帮助
```