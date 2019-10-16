function getDbConfig() {
    return {
        host: 'kingsport.top',
        port: 3306,
        user: 'gisdb',
        password: 'qq123456',
        database: 'sportdb',
        multipleStatements: true
    }
}

module.exports = {
    getDbConfig: getDbConfig
}