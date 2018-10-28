const User = require('./user.model');
const Schedule = require('../schedule/schedule.model');
const { sign } = require('../lib/jwt');
const { omit } = require('lodash')

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new schedule
 * @property {string} name - The name of schedule.
 * @property {string} description - The description of schedule.
 * @returns {Schedule}
 */
async function createSchedule(user_id, name) {
  const schedule = new Schedule({
    user_id,
    name
  });

  return await schedule.save().then(savedSchedule => savedSchedule).catch(e => e);
}


/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function create(req, res, next) {
  console.log('entrou aqui no create user');
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  user.token = sign(user)
  // console.log('create user:: ', user);
  // console.log('User? ', user);
  user.save()
    .then((savedUser) => {
      createSchedule(savedUser._id, savedUser.username);
      return user.toJSON(savedUser);
    })
    .then(savedUser => {
      res.json({user: omit(savedUser, ['token']), token: savedUser.token})
    })
    .catch(e => next(User.checkDuplicate(e)));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.password = req.body.password;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list (req, res, next) {
  const {_id} = req.user;
  console.log('RESULTADO USUARIO: ')
  const { limit = 50, skip = 0 } = req.query;
  User.find({_id: {$ne: _id}}, {_id: 1, username: 1})
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
