function getDbConfig() {
    return {
        host: 'localhost',
        port: 3306,
        user: 'gisdb',
        password: '1234Qwer',
        database: 'sportdb',
        multipleStatements: true
    }
}

module.exports = {
    getDbConfig: getDbConfig
}