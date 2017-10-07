let log = require('./../../lib/util/log');

module.exports = function(configPath) {
    try {
        require(configPath);
    } catch (err) {
        log.error(err);
        return false;
    }
    return true;
};
