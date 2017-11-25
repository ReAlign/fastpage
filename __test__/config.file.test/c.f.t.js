let log = require('n-s-logs');

module.exports = function(configPath) {
    try {
        require(configPath);
    } catch (err) {
        log.error(err);
        return false;
    }
    return true;
};
