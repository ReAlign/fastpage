var config = {
    tempPath: '/webapp/s_tpl',
    page: [
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
    replaceEvt: function () {
        //
    }
};

module.exports = config;