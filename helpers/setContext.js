const config = require('config')
const { environmentTokens } = require('../config/appConfig')
const { logger } = require('./logger.js')
const models = require('../models/index.js')

/**
 * Context function from Apollo Server
 */
exports.setContext = async ({ req, res }) => {
    const context = {
        di: {
            model: {
                ...models
            },
        },
        res
    }

    const token = req.headers['authorization']
    // if(!token) {
    //     throw Error('Token is missing in the request header'); 
    // }
    if (token && typeof token === 'string') {
        context.token = token.split(' ')[1];
        // context.user = await decodeTokenAndFindUser(token);
        // const roleObject = new RoleMethod(context.di.model.Roles);
        // const userRoles = await roleObject.getRoleFromUser(context);
        // context.role = userRoles?.[0];
        //Do not check if context.user and context.role are empty here as for a new user they will always return empty 
        //unless authenticateUser has been executed which won't happen if we keep returning the user from here
    }
    return context
}
