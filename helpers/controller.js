const transformIndividualApplication = (application) => {
  const {
    title,
    type,
    amount,
    startDate,
    endDate,
    frequency,
    _id: id,
  } = application;
  return {
    title,
    type,
    amount,
    startDate,
    endDate,
    frequency,
    id,
  };
};

const transformIndividualReport = (report) => {
  const { amount, description, paidDate, nextDate, _id: id } = report;
  return {
    amount,
    description,
    paidDate,
    nextDate,
    id,
  };
};

const transformApplicationsData = (applicationsData) => {
  const transformedApplicationsData = applicationsData.map((application) => {
    const transformedApplication = transformIndividualApplication(
      application._doc
    );
    return transformedApplication;
  });
  return transformedApplicationsData;
};

module.exports = {
  transformApplicationsData,
  transformIndividualApplication,
  transformIndividualReport,
};
