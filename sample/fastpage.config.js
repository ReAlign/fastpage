var config = {
    page: {
        tempPath: 'webapp/s_tpl',
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
                dynamic: true,
                rex: '~value~',
                global: true,
                str: 'replace value'
            },
            {
                rex: '~aaaaa~',
                global: true,
                str: 'replace aaaaa'
            }
        ]
    },
    modal: {
        tempPath: 'webapp/s_tpl/modal',
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

