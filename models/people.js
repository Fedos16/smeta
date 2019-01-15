const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    fio: {
        type: String
    },
    numberFio: {
        type: String
    },
    telephone: {
        type: String
    },
    birthday: {
        type: String
    },
    typePeople: {
        type: String
    },
    status: {
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

module.exports = mongoose.model('People', schema);      