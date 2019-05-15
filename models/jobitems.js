const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    Name: {
        type: String
    },
    Price: {
        type: String
    },
    UnitMe: {
        type: String
    },
    Status: {
      type: Boolean,
      default: true
    }
  },
  {
        timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('JobItems', schema);      