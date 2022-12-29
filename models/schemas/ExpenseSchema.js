const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Expanse = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['DEBIT', 'CREDIT', 'LOAN', 'INVESTMENT'],
    },
    amount: {
      type: Number,
    },
    frequency: {
      type: String,
      required: true,
      enum: ['DAILY', 'MONTHLY', 'YEARLY', 'CUSTOM'],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Report',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Expanse;
