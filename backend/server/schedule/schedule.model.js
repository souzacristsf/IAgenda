const Promise = require('bluebird');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const event = [{
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date_initial: {
    type: Date,
    default: Date.now
  },
  date_end: {
    type: Date,
    default: Date.now
  },
  shared_user_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}];
/**
 * Schedule Schema
 */
const ScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shared_user_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },  
  event,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
// UserSchema.method({
// });

/**
 * Statics
 */

// UserSchema.statics = {
//   /**
//    * Get user
//    * @param {ObjectId} id - The objectId of user.
//    * @returns {Promise<User, APIError>}
//    */
//   get(id) {
//     return this.findById(id)
//       .exec()
//       .then((user) => {
//         if (user) {
//           return user;
//         }
//         const err = new APIError('Usuario não existe!', httpStatus.NOT_FOUND);
//         return Promise.reject(err);
//       });
//   },
//   /**
//    * @param  {} field - return user
//    * @returns {Promise<User, APIError>}
//    */
//   findByField(field) {
//     return this.findOne({ $or: [{ username: field }, { email: field }] })
//       .exec()
//       .then((user) => {
//         if (user) {
//           return user;
//         }
//         const err = new APIError('Usuario ou Senha incorreto!!!', httpStatus.NOT_FOUND);
//         return Promise.reject(err);
//       });
//   },

//   /**
//    * List users in descending order of 'createdAt' timestamp.
//    * @param {number} skip - Number of users to be skipped.
//    * @param {number} limit - Limit number of users to be returned.
//    * @returns {Promise<User[]>}
//    */
//   list({ skip = 0, limit = 50 } = {}) {
//     return this.find()
//       .sort({ createdAt: -1 })
//       .skip(+skip)
//       .limit(+limit)
//       .exec();
//   }
// };

/**
 * @typedef Schedule
 */
module.exports = mongoose.model('Schedule', ScheduleSchema);
