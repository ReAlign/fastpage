# fastpage

## Introduction

A tool to quickly generate front-end pages and associated files

# Install & run

```
// install
$ npm install fastpage -g
```

> you can use `fp` globally instead of the `fastpage` command

At project root directory, and run:

```
// init config file
$ fp -i
```

```
// generate page and associated files
$ fp
```

# Configuration

`fastpage.config.js` sample:

```javascript
var config = {
    baseTplPath: 's_tpl',       // template directory
    useTplPath: 'view',         // Page template directory
    useJsPath: 'page'           // page js directory
};

module.exports = config;
```

# cli

```
-v, --version,   print version
-i, --init,      create fastpage.config.js
-h, --help,      print help
```


