const axios = require('axios')
const async = require('async')
const { logger } = require('../../helpers/logger')
const {
    userRegisterController,
    userLoginController,
    userRefreshController
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
                       success: res.status
                    }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        ),
        loginUser: combineResolvers(
            async (parent, { usersInput }, context) => {
                try {
                    const res = await userLoginController(usersInput,context);
                    return {
                       success: res.status,
                       accessToken: res.accessToken
                    }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        ),
        // logoutUser: combineResolvers(
        //     async (parent, { usersInput }, context) => {
        //         try {
        //             // const res = await userRegisterController(usersInput,context);
        //             // return {
        //             //    success: res.status,
        //             //    token: res.token
        //             // }
        //         } catch (error) {
        //             logger.error(error)
        //             throw new Error(error)
        //         }
        //     }
        // ), 
        refreshUser: combineResolvers(
            async (parent, { tokenInput }, context) => {
                try {
                    const res = await userRefreshController(tokenInput,context);
                    return {
                        success: res.status,
                        accessToken: res.accessToken
                     }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        ), 
    },
}
