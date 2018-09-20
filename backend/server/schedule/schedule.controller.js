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

function getMySchedule(req, res, next) {
  const { _id } = req.user;
  const { user_id } = req.params;

  Schedule.find({ user_id })
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));

  console.log('_id: ', _id, 'user_id: ', user_id);
}

function updateScheduleNewEvent(req, res, next) {
  const { _id } = req.params;
  const { _id: user_id } = req.user;
  const { name, description, date_initial, date_end, shared_user_id } = req.body;

  console.log('Entrou no update: ', _id);
  console.log('Entrou no update user_id: ', user_id);
  console.log('Entrou no update body: ', req.body);
  Schedule.update(
    { _id, user_id },
    { $push: { event: { name, description, date_initial, date_end } } }
  )
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));
}

function updateScheduleFromEvent(req, res, next) {
  const { _id, id_event } = req.params;
  const { _id: user_id } = req.user;
  const { name, description, date_initial, date_end, shared_user_id } = req.body;

  console.log('Entrou no update: ', _id);
  console.log('Entrou no update user_id: ', user_id);
  console.log('Entrou no update body: ', req.body);
  Schedule.update(
    { _id, user_id, 'event._id': id_event },
    {
      $set: {
        'event.$.name': name,
        'event.$.description': description,
        'event.$.date_initial': date_initial,
        'event.$.date_end': date_end
      }
    }
  )
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const { _id, id_event } = req.params;
  const { _id: user_id } = req.user;

  console.log('Entrou no delete: ', _id, id_event);
  console.log('Entrou no delete user_id: ', user_id);
  Schedule.update(
    { _id, user_id },
    { $pull: { event: { _id: id_event } } }
  )
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));
}

module.exports = { create, getMySchedule, updateScheduleNewEvent, remove, updateScheduleFromEvent };
