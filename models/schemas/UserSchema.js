var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = new Schema({
  email: {
    type: String
  },
  mobileNumber: {
    type: Number
  },
  password: {
    type: String
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
});
module.exports = { User }