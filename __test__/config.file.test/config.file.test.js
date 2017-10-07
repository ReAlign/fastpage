const checkFpConfig = require('./c.f.t');
const path = require('path');

test('checkFpConfig', function() {
     expect(checkFpConfig(path.join(__dirname,  'fixtures', 'fastpage.config.js'))).toBe(true);
});

test('checkFpConfigNotExist', function() {
     expect(checkFpConfig(path.join(__dirname, 'fixtures', 'fastpage.config.notExist.js'))).toBe(false);
});

test('checkFpConfigDepNotExist', function() {
     expect(checkFpConfig(path.join(__dirname, 'fixtures', 'fastpage.config.1.js'))).toBe(false);
});