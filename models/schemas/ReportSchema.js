var mongoose = require('mongoose');
const Expense = require('./ExpenseSchema');
var Schema = mongoose.Schema;

const Report = new Schema(
  {
    amount: {
      type: Number,
    },
    description: {
      type: String,
    },
    paidDate: {
      type: Date,
    },
    nextDate: {
      type: Date,
    },
    title: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
    },
    expenseId: {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
    },
    ACL: {
      read: {
        type: Boolean,
      },
      write: {
        type: Boolean,
      },
      delete: {
        type: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Report;
