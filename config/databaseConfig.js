function getDbConfig() {
    return {
        host: '*******',
        port: 3306,
        user: 'gisdb',
        password: '*******',
        database: 'sportdb',
        multipleStatements: true
    }
}

module.exports = {
    getDbConfig: getDbConfig
}