const mongoose = require('mongoose')
const {
    User,
    Expense,
    Report,
    Role
} = require('./schemas/index')

module.exports = {
    User: mongoose.model('user', User),
    Expense: mongoose.model('expense', Expense),
    Report: mongoose.model('report', Report),
    Role: mongoose.model('role', Role),
}
