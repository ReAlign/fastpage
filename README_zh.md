# fastpage

## 简介

快速生成前端页面和相关文件的工具

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


