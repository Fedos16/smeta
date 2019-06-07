const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    Room: {
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

module.exports = mongoose.model('Architecture', schema);      