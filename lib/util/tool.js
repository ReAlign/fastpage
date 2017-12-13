'use strict';

// let log = require('n-s-logs');

let util = {
    initPrivKeysPath: function(_keys, conf, _folderPathArr, _answers) {
        var _keysPath = {};
        _keys.every(function(item) {
            if(item.key == 'mcss' && conf.mcssTopLevel) {
                _keysPath[item.key] = _folderPathArr.slice(0, 1);
            } else {
                _keysPath[item.key] = _folderPathArr;
                if(item.path2) {
                    let _path2 = item.path2.split('/');

                    if(_answers.name) {
                        let _names = _answers.name.split('/');
                        if(_names && _names.length > 1) {
                            let _namesFolder = _names.slice(0, _names.length - 1);
                            _path2 = _path2.concat(_namesFolder);
                        }
                    }

                    _keysPath[item.key] = _folderPathArr.concat(_path2);
                }
            }

            return true;
        });

        if(!_keysPath.mcss) {
            _keysPath.mcss = _folderPathArr;
        }

        return _keysPath;
    },
    initPrivReplaceArr: function(_answers) {
        var _replaceArr = {};
        for(let k in _answers) {
            if (_answers.hasOwnProperty(k) && _answers[k] != 'folderPath'){
                _replaceArr[k] = _answers[k];
            }
        }

        return _replaceArr;
    }
};

module.exports = util;