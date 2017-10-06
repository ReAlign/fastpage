'use strict';

let util = {
    initPrivKeysPath: function(_keys, conf, _folderPathArr) {
        var _keysPath = {};
        _keys.every(function(item) {
            if(item.key == 'mcss' && conf.mcssTopLevel) {
                _keysPath[item.key] = _folderPathArr.slice(0, 1);
            } else {
                _keysPath[item.key] = _folderPathArr;
                if(item.path2) {
                    _keysPath[item.key] = _folderPathArr.concat(item.path2.split('/'));
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