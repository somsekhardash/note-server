const { CrudMethod } = require('./../../models/methods');
const { logger, endLogger } = require('./../../helpers/logger');
const {
  transformIndividualApplication,
  transformIndividualReport,
} = require('./../../helpers/controller');
/**
 * function to get applications
 * @param {object} args arguments provided by user to query on
 * @param {object} context graphQl context object that has logged in user and model data
 * @returns {array} applications
 */
const getExpenses = async (args, context) => {
  try {
    const { Expense } = context.di.model;
    const expensesObj = new CrudMethod(Expense);
    const { page, limit = 1, ...restArgs } = args;
    let options = {};
    if (page && limit) {
      options = {
        limit,
        skip: (page - 1) * limit,
        sort: {
          updatedAt: 'desc',
        },
      };
    }
    options = args.getAll
      ? {
          ...options,
          select: {
            _id: 1,
            title: 1,
            type: 1,
            amount: 1,
            frequency: 1,
            reports: 1,
          },
        }
      : options;
    // const query = await buildQuery(restArgs, "application");
    // if (!query) {
    //     throw new Error('No arguments/model passed to query');
    // }
    // fetches all application
    let applicationsData = null;
    if (restArgs.title) {
      const tempApplicationsData = await expensesObj.findOneDocument(restArgs);
      applicationsData = [await tempApplicationsData.populate('reports')];
    } else {
      applicationsData = await expensesObj.findDocument(restArgs, options);
      // applicationsData = await tempApplicationsData.populate({ path: 'reports'});
      // applicationsData = await tempApplicationsData.populate('reports');
    }
    // modifies applicationsData to include permission object and different dates on each application returned
    // applicationsData = await controllerHelpers().transformApplicationsData(applicationsData, context.role)
    const applicationsPayload = {
      data: applicationsData.map((node) => {
        const {
          title,
          type,
          frequency,
          amount,
          startDate,
          endDate,
          _id,
          reports,
        } = node;
        return {
          title,
          type,
          frequency,
          amount,
          startDate,
          endDate,
          _id,
          reports,
        };
      }),
    };
    if (page) {
      const totalCount = await applicationObj.countDocuments();
      applicationsPayload.pagination = {
        page,
        limit,
        totalCount,
      };
    }
    return applicationsPayload;
  } catch (err) {
    logger.error(err.message);
    throw new Error(err.message);
  }
};

const getReports = async (args, context) => {
  try {
    const { Report } = context.di.model;
    const reportsObj = new CrudMethod(Report);
    const { page, limit = 1, ...restArgs } = args;
    let options = {};
    if (page && limit) {
      options = {
        limit,
        skip: (page - 1) * limit,
        sort: {
          updatedAt: 'desc',
        },
      };
    }

    options = args.getAll
      ? {
          ...options,
          select: {
            _id: 1,
            amount: 1,
            description: 1,
            paidDate: 1,
            nextDate: 1,
            isCompleted: 1,
            title: 1,
            expenseId: 1,
          },
        }
      : options;
    // const query = await buildQuery(restArgs, "application");
    // if (!query) {
    //     throw new Error('No arguments/model passed to query');
    // }
    // fetches all application

    let reportsData = await reportsObj.findReportDocument(restArgs, options);

    // const populateReports = async (application) => {
    //     return await application?.populate({ path: "type", options: { _recursed: true } });
    // }

    // const populatedApplication = await populateReports(reportsData);

    // console.log(applicationsData, 'applicationsData');
    // modifies applicationsData to include permission object and different dates on each application returned
    // applicationsData = await controllerHelpers().transformApplicationsData(applicationsData, context.role)
    const applicationsPayload = {
      data: reportsData.map((node) => {
        const {
          amount,
          description,
          paidDate,
          nextDate,
          expenseId,
          isCompleted,
          title,
          _id,
        } = node;
        return {
          amount,
          description,
          paidDate,
          nextDate,
          expenseId,
          title,
          isCompleted,
          _id,
        };
      }),
    };
    if (page) {
      const totalCount = await applicationObj.countDocuments();
      applicationsPayload.pagination = {
        page,
        limit,
        totalCount,
      };
    }
    return applicationsPayload;
  } catch (err) {
    logger.error(err.message);
    throw new Error(err.message);
  }
};

const saveExpense = async (args, context) => {
  const { Expense } = context.di.model;
  const expenseObj = new CrudMethod(Expense);
  const { ...restArgs } = args;
  let applicationData = await expenseObj.createDocument(restArgs);
  return transformIndividualApplication(applicationData);
};

const saveReport = async (args, context) => {
  const { Report, Expense } = context.di.model;
  const reportObj = new CrudMethod(Report);
  const expObj = new CrudMethod(Expense);
  const { ...restArgs } = args;
  // if(args.isCompleted) {
  //   await reportObj.createDocument({
  //     type: args.type,
  //     amount: 0,
  //     paidDate: args.nextDate,
  //     nextDate: null,
  //     isCompleted: false,
  //     description: ''
  //   });
  // }
  let reportData = await reportObj.createDocument(restArgs);

  if (reportData.expenseId) {
    const existingExpense = await Expense.find({ _id: reportData.expenseId });
    if (existingExpense.length) {
      const som = await expObj.updateDocument(
        { _id: existingExpense[0]._id },
        {
          ...existingExpense,
          reports: [...existingExpense[0].reports, reportData._id],
        }
      );
      console.log('=================>', som, '<=================');
    }
  }
  // return transformIndividualReport(reportData);
};

const updateTheReport = async (args, context) => {
  const { Report } = context.di.model;
  const reportObj = new CrudMethod(Report);
  const { ...restArgs } = args;
  let reportData = await reportObj.updateDocument(
    restArgs.findI,
    restArgs.data
  );
  return transformIndividualReport(reportData);
};

// const updateTheExpense = async (args, context) => {
//   const { Expense } = context.di.model;
//   const reportObj = new CrudMethod(Expense);
//   const { ...restArgs } = args;
//   console.log(restArgs, "restArgs");
//   let reportData = await reportObj.updateDocument(restArgs.findI, restArgs.data);
//   return transformIndividualReport(reportData);
// };

module.exports = {
  getExpenses,
  saveExpense,
  saveReport,
  getReports,
  updateTheReport,
};
