
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Expanse = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["DEBIT", "CREDIT", "LOAN", "INVESTMENT"]
  },
  amount: {
    type: Number
  },
  frequency: {
    type: String,
    required: true,
    enum: ["DAILY", "MONTHLY", "YEARLY", "CUSTOM"]
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  ACL: {
    read: {
      type: Boolean
    },
    write: {
      type: Boolean
    },
    delete: {
      type: Boolean
    }
  }
},
{
    timestamps: true
});

module.exports = Expanse

