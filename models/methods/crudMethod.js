const BaseMethod = require('./baseMethod');
const mongoose = require('mongoose');

const CrudMethod = class extends BaseMethod {
  constructor(model) {
    super(model);
  }

  async findDocument(findQuery = {}, options = {}) {
    const { select = null, ...restOptions } = options;
    if (findQuery.month || findQuery.year) {
      return this.model.find({
        $and: [
          { $expr: { $lte: [{ $month: '$startDate' }, findQuery.month] } },
          { $expr: { $lte: [{ $year: '$startDate' }, findQuery.year] } },
          { $expr: { $eq: ['$frequency', findQuery.frequency] } },
        ],
      });
    }

    return this.model.find(findQuery, select, restOptions);
  }

  async findReportDocument(findQuery = {}, options = {}) {
    const { select = null, ...restOptions } = options;

    if (findQuery.month || findQuery.year) {
      return this.model.find({
        $or: [
          {
            $and: [
              {
                $expr: { $eq: [{ $month: '$nextDate' }, findQuery.month] },
              },
              { $expr: { $eq: [{ $year: '$nextDate' }, findQuery.year] } },
            ],
          },
          {
            $and: [
              {
                $expr: { $eq: [{ $month: '$paidDate' }, findQuery.month] },
              },
              { $expr: { $eq: [{ $year: '$paidDate' }, findQuery.year] } },
            ],
          },
        ],
      });
    }
    return this.model.find(findQuery, select, restOptions);
  }

  async findOneDocument(findQuery = {}) {
    return this.model.findOne(findQuery);
  }

  async createDocument(data) {
    const newDocument = new this.model(data);
    const newData = await newDocument.save();
    return newData;
  }

  async updateDocument(findQuery, data) {
    if (findQuery._id) {
      findQuery._id = mongoose.Types.ObjectId(findQuery._id);
    }
    const updatedDocument = await this.model.findOneAndUpdate(findQuery, {
      ...data,
    });
    return updatedDocument;
  }

  async countDocuments() {
    return await this.model.countDocuments();
  }
};

module.exports = CrudMethod;
