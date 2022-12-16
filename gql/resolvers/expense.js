const axios = require('axios')
const async = require('async')
const { logger } = require('../../helpers/logger')
const {
    saveExpense,
    getExpenses,
    saveReport,
    getReports,
    updateTheReport
} = require('../controllers/expenseController.js')
const { combineResolvers } = require('graphql-resolvers');

const { isAuthenticated } = require('./../../helpers/middleware')

/**
 * All resolvers related to applications
 * @typedef {Object}
 */
module.exports = {
    Query: {
        /**
         * It allows to fetch applications
         */
        fetchExpenses: combineResolvers(isAuthenticated, async (parent, args, context) => {
            try {
                /*Used to check the jwt token for API authorization*/
                // authValidations.isUserLoggerdIn(context)
    
                // authValidations.ensureThatUserIsAdministrator(context);
    
                const expenses = await getExpenses(args, context); 
                    return {
                        data: expenses.data,
                        success: true
                    };
               
            } catch (error) {
                // logger.error(error)
                throw new Error(error)
            }
        }) ,

        fetchReports: async (parent, args, context) => {
            try {
                const reports = await getReports(args, context); 
                    return {
                        data: reports.data,
                        success: true
                    };
            } catch (error) {
                // logger.error(error)
                throw new Error(error)
            }
        },

    },
    Mutation: {
        createExpenses: combineResolvers(
            async (parent, { expensesInput }, context) => {
                try {
                    const res = await saveExpense(expensesInput,context);
                    return {
                       ...res
                    }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        ),
        createReport:  combineResolvers(
            async (parent, { reportInput }, context) => {
                try {
                    const res = await saveReport(reportInput,context);
                    return {
                       ...res
                    }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        ),
        updateReport:  combineResolvers(
            async (parent, { reportInput }, context) => {
                try {
                    const res = await updateTheReport(reportInput,context);
                    return {
                       ...res
                    }
                } catch (error) {
                    logger.error(error)
                    throw new Error(error)
                }
            }
        ),
    },
}
