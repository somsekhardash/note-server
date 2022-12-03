const axios = require('axios')
const async = require('async')
const { logger } = require('../../helpers/logger')
const {
    userRegisterController
} = require('../controllers/userController.js')
const { combineResolvers } = require('graphql-resolvers');

/**
 * All resolvers related to applications
 * @typedef {Object}
 */
module.exports = {
    Mutation: {
        registerUser: combineResolvers(
            async (parent, { usersInput }, context) => {
                try {
                    const res = await userRegisterController(usersInput,context);
                    return {
                       ...res
                    }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        )
    },
}
