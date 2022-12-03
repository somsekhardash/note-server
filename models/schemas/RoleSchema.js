var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Role = new Schema({
  role: {
    type: String
  },
  Permission: {
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
module.exports = { Role }
