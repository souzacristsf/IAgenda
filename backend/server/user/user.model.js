const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  token: {
    type: String
  },
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
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('Usuario não existe!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * @param  {} field - return user
   * @returns {Promise<User, APIError>}
   */
  findByField(field) {
    return this.findOne({ $or: [{ username: field }, { email: field }] })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('Usuario ou Senha incorreto!!!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

    /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicate(error) {
    // console.log('Teste user: ', error)
    if (error.name === 'MongoError' && error.code === 11000) {
      // console.log('MongoError: ', error)
      return new APIError('username or e-mail already exists', httpStatus.CONFLICT, true);
      // return Promise.reject(err)
    }

    return error;
  }

};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
