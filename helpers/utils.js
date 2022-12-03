const mongoose = require('mongoose')
const { default: axios } = require('axios')
const isEmpty = require('lodash.isempty')
// const configData = require('./queryBuilderFixture');
const { environmentTokens } = require('../../config/appConfig');
const { logger } = require('./logger');

/**
 * function to sanitize
 * @param {string} str string input to sanitize
 * @returns {string} sanitized value (removes all special characters from input)
 */
const sanitize = (str) => {
    const regexToSanitize = /[^a-zA-Z0-9 ]/g
    return str.replace(regexToSanitize, "");
}


/**
 * function to build query before db operation
 * @param {object} queryArgs query arguments from which db query is built
 * @param {string} modelName accepts model name for which query needs to be build (Eg.: application/role/user).
 * @returns {object} query for db operation on that model
 */
 const buildQuery = (queryArgs, modelName = "application") => {
    let query = {}
    let queryPath
    if (isEmpty(queryArgs) || (typeof queryArgs !== 'object' && !Array.isArray(queryArgs))) {
        // empty check for the arguments passed
        return false;
    } else {
        // iterates over each query argument in the model to get the query path and build the key-value for it
        for (let key in queryArgs) {
            if (Object.prototype.hasOwnProperty.call(queryArgs, key)) {
                queryPath = findQueryPath(modelObject, key) // gets query path for the key/property in the model. Eg-> for status, queryPath = details.status
                if (queryPath) {
                    if (queryPath === '_id' || queryPath.indexOf('_id') !== -1) { // specific check for document ID
                        query[queryPath] = mongoose.Types.ObjectId(queryArgs[key])
                    } else if (typeof queryArgs[key] === 'string') {
                        if (queryArgs[key]) {
                            const sanitizedString = sanitize(queryArgs[key]) // removes special characters from string
                            query[queryPath] = {
                                $regex: sanitizedString, // wild card search option
                                $options: 'i'
                            }
                        }
                    } else {
                        query[queryPath] = queryArgs[key]
                    }
                }
            }
        }
    }

    return query;
}

/**
 * function to find complete query path for the queried key
 * @param {object} fixtureObj dummy object for the model where key needs to be found to get the complete path of that key
 * @param {string} queryKey key to search the path for in the fixture object
 * @returns {object} complete path of the queryKey
 */
const findQueryPath = (fixtureObj, queryKey) => {
    const path = []  // stores all parent keys upto the queryKey
    
    // Recursive function to check if queryKey exist within an object/array or direct at top level
    const keyExists = (obj) => {
        if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
            // empty check on the model object
            return false;
        } else if (Object.prototype.hasOwnProperty.call(obj, queryKey)) {
            // identifies if queryKey is present direct on top level
            path.push(queryKey);
            return true;
        } else if (Array.isArray(obj) && typeof obj[0] === "object") {
            // identifies if queryKey is within an array of objects
            for (let i in obj) {
                const result = keyExists(obj[i]);
                if (result) {
                    return result;
                }
                path.pop();
            }
        } else {
            // identifies if queryKey is present in a nested object level
            for (let k in obj) {
                path.push(k);
                const result = keyExists(obj[k]);
                if (result) {
                    return result;
                }
                path.pop();
            }
        }
        return false;
    }

    keyExists(fixtureObj);

    return path.join('.'); // returns the found path of the queryKey
}

/**
 * function to format REST API error response
 * @param {object} res response object
 * @param {integer} statusCode status code of the response
 * @param {string} errorMessage error text
 * @returns {object} error object response
 */
const restErrorFormatter = (res, statusCode = 500, errorMessage) => {
    return res.status(statusCode).json({
        errors: [{
            message: errorMessage
        }]
    })
}

/**
 * function to get access domain url
 * @param {object} environmentTokens environment tokens from appConfig
 * @returns {string} access domain url
 */
const getAccessDomain = (environmentTokens) => {
    const { accessDomain } = environmentTokens
    return accessDomain
}

/**
 * function to get raw jwt token
 * @param {string} token token with bearer
 * @returns {object} token without bearer
 */
const getRawJwtToken = (tokenWithBearer) => {
    if (tokenWithBearer && typeof tokenWithBearer === 'string') {
        const authenticationScheme = 'Bearer '
        if (tokenWithBearer.startsWith(authenticationScheme)) {
            var tokenWithoutBearer = tokenWithBearer.slice(authenticationScheme.length, tokenWithBearer.length)
        }
    }
    return tokenWithoutBearer;
}

/**
 * function to validate token from an external api (access.conde)
 * @param {string} token token without bearer
 * @returns {boolean} flag to know if token is valid
 */
 const validateToken = async (token) => {
    try {
        const accessUrl = getAccessDomain(environmentTokens)
        const result = await axios({
            method: 'get',
            url: `${accessUrl}/v2/public/fetch`,
            headers: { 'Authorization': `Bearer ${token}` },
        })
        return !!(result?.data?.token)

    } catch (error) {
        logger.error(error.message)
        throw new Error(error.message)
    }
}

/**
 * function to check token validity
 * @param {string} token token with bearer
 * @returns {boolean} flag to know if token is valid
 */
const getTokenValidity = async (token) => {
    const tokenWithoutBearer = getRawJwtToken(token);
    const isTokenValid = await validateToken(tokenWithoutBearer);
    if (!isTokenValid) {
        throw new Error('Unauthorized');
    }
    return isTokenValid;
}

module.exports = {
    buildQuery,
    getTokenValidity,
    decodeToken,
    getAccessDomain,
    getRawJwtToken,
    restErrorFormatter,
    sanitize,
    validateToken,
}
