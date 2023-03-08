const mongoose = require('mongoose');
const { Report } = require('./models');
const { Expense } = require('./models');
mongoose.connect(
  'mongodb+srv://admin:admin@somcluster.1cyvrwm.mongodb.net/note-db?retryWrites=true&w=majority'
);
const db = mongoose.connection;

db.on('error', (err) => {
  console.log(`Connection error with database. ${err}`);
});

db.once('open', () => {
  console.log(`Connected with database`);
  initApplication();
});

const initApplication = async () => {
  // const som = await Report.find({});
  //  Report.updateMany({}, { $rename: { 'som' : 'expenseId'} });
  // Expense.updateMany({}, {$unset: {reports: 1}}, { multi: true }, (err, results) => {
  //   console.log(err, results);
  //  });
  // console.log(som);
  // Report.aggregate([
  //   {
  //     $lookup: {
  //       from: 'expenses',
  //       localField: 'title',
  //       foreignField: 'title',
  //       as: 'expenseId',
  //     }
  //   },
  //   {$set: { expenseId: { $first: "$expenseId._id" } }},
  //   { $out: "reports" }
  // ]).exec(function (err, results) {
  //   console.log(err, results);
  // });

  // add reports field in Expense
  // Expense.aggregate([
  //   {
  //     $lookup: {
  //       from: 'reports',
  //       localField: '_id',
  //       foreignField: 'expenseId',
  //       as: 'reports',
  //     },
  //   },
  //   {
  //     $set: {
  //       reports: '$reports._id',
  //     },
  //   },
  //   { $out: 'expenses' },
  // ]).exec(function (err, results) {
  //   console.log(err, results);
  // });

  db.report.updateMany(
    {},
    { $unset: { som: 1 } },
    { multi: true },
    (err, results) => {
      console.log(err, results);
    }
  );
  // console.log(som);
};
