const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    Name: {
        type: String
    },
    Categories: {
        type: Array
    },
    SubCategories: {
        type: Array
    },
    RoomNumber: {
        type: Array
    },
    Price: {
        type: String
    },
    UnitMe: {
        type: String
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