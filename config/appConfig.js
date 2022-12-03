const dotenv = require('dotenv');
const config = require('config');
dotenv.config()

exports.environmentTokens = Object.freeze({
    dbHost: config.get('mongodb.host'),
    dbPort: config.get('mongodb.port'),
    database: process.env.MONGO_DB || '',
    mongoUser: process.env.MONGO_USER || '',
    mongoPass: process.env.MONGO_PASS || '',
    mongoDBUrl: config.get('mongodb.url'),
    port: config.get('NODE_PORT'),
})
