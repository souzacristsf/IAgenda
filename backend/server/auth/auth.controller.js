const { sign } = require('../lib/jwt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/user.model');

// sample user, used for authentication
// const user = {
//   username: 'react',
//   password: 'express'
// };

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function auth(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const { username, password } = req.body;

  User.findByField(username)
    .then(user => comparePassword(password, user))
    .then(user => updateTokenUser(user, sign(user)))
    .then(({ user, token }) => {
      res.json({ user, token, success: true });
    })
    .catch(err => next(err));


  // const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  // return next(err);
}

function comparePassword(passwordBody, { email, password, username, _id }) {
  return new Promise((resolve, reject) => {
    if (passwordBody !== password) {
      reject(new APIError('Usuario ou Senha incorreto!!!', httpStatus.UNAUTHORIZED, true));
    }
    resolve({
      email, username, _id
    });
  });
}

/**
 * Update existing user
 * @property {User} user - The username of user.
 * @property {string} token - The password of user.
 * @returns {User}
 */
function updateTokenUser(user, token) {
  return new Promise((resolve, reject) => {
    User.update({ _id: user._id }, { $set: { token } })
    .exec()
    .then((updateToken) => {
      if (updateToken.nModified) {
        return resolve({ user, token });
      }
      return reject(new APIError('Ocorreu um erro ao atualizar token!!!', httpStatus.NOT_FOUND, true));
    });
  });
}


/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { auth, getRandomNumber };
