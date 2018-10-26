const mongoose = require('mongoose');

const validatorId = object => mongoose.Types.ObjectId.isValid(object);

const objectId = object => mongoose.Types.ObjectId(object);

module.exports = {
  validatorId,
  objectId
};
