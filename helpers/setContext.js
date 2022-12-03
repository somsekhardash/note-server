const config = require('config')
const { environmentTokens } = require('../config/appConfig')
const { logger } = require('./logger.js')
const models = require('../models/index.js')

/**
 * Context function from Apollo Server
 */
exports.setContext = async ({ req }) => {
    const context = {
        di: {
            model: {
                ...models
            },
        }
    }
    return context
}
