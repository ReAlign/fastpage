# fastpage

## Introduction

A tool to quickly generate front-end pages and associated files

# Install & run

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
// just fp , also you can run: fp -r page
$ fp
```

#### create page with config list
```
$ fp -r modal
```

# Configuration

`fastpage.config.js` sample:

```javascript
var config = {
    page: {
        tempPath: '/webapp/s_tpl',
        list: [
            {
                key: 'tpl',
                path: 'webapp/WEB-INF/view',
                tempPath: ['index.ftl'],
                name: ['index.ftl']
            },
            {
                key: 'mcss',
                path: 'webapp/src/mcss',
                tempPath: ['main.mcss'],
                name: ['main.mcss']
            },
            {
                key: 'js',
                path: 'webapp/src/page',
                tempPath: ['entry.js'],
                name: ['entry.js']
            },
            {
                key: 'jsCom',
                path: 'webapp/src/page',
                path2: 'components',
                tempPath: ['index.js', 'index.html'],
                name: ['index.js', 'index.html']
            }
        ],
        mcssTopLevel: true,
        replaceList: [
            {
                rex: '~value~',
                global: true,
                str: 'replace value'
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


