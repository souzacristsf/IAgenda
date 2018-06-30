const Schedule = require('../schedule/schedule.model');

/**
 * Create new schedule
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {Schedule}
 */

function create(req, res, next) {
  const { _id: user_id } = req.user;
  const { name, event, shared_user_id } = req.body;
  const schedule = new Schedule({
    user_id,
    name,
    event,
    shared_user_id
  });

  schedule.save()
    .then(savedSchedule => res.json(savedSchedule))
    .catch(e => next(e));
}

module.exports = { create };
