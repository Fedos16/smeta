const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    IdObject: {
        type: String
    },
    AddressObject: {
        type: String
    },
    DateCreate: {
        type: String
    },
    NameClient: {
        type: String
    },
    Telephone: {
        type: Array
    },
    Estimator:{
        type: String
    },
    Rooms: {
        type: Object
    }
  },
  {
        timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Documents', schema);      