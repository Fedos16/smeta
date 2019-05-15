const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    Name: {
        type: String
    },
    Status: {
        type: Boolean
    }
  },
  {
        timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Rooms', schema);      