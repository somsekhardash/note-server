const merge = require('lodash.merge')
const users = require('./users.js')
// const auth = require('./auth.js')
const expense = require('./expense.js')

exports.resolvers = merge(expense, users)
