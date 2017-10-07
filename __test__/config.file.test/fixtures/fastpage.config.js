var config = {
    page: {
        tempPath: '/webapp/s_tpl',
        list: [
            {
                key: 'tpl',
                path: 'webapp/WEB-INF/view',
                tempPath: ['index.ftl'],
                name: ['index.ftl']
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
    }
};

module.exports = config;

