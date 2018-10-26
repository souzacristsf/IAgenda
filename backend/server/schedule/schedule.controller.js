const Schedule = require('../schedule/schedule.model');
const { objectId } = require('../lib/objectId')
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
  const user_id = objectId(req.params.user_id);


  var $match = {
    $match: {user_id} //: ObjectId('5ba261f35dc0463b3063135f')
  }

  console.log('_id: ', _id, 'user_id: ', user_id, $match);

  var unw = { "$unwind": { path: "$event", "preserveNullAndEmptyArrays": true } }

  var $lookup = {
    $lookup: {
      from: 'users',
      localField: 'event.shared_user_id',
      foreignField: '_id',
      as: 'event.shared_user_id'
    }
  }

  var unww = { "$unwind": { path: "$event.shared_user_id", "preserveNullAndEmptyArrays": true } }

  var $project = {
    $project: {
      _id: "$_id",
      user_id: "$user_id",
      name: "$name",
      createdAt: "$createdAt",
      event: {
        date_initial: "$event.date_initial",
        date_end: "$event.date_end",
        _id: "$event._id",
        description: "$event.description",
        name: "$event.name",
        shared_user_id: {
          "_id" : "$event.shared_user_id._id",
          "username" : "$event.shared_user_id.username"
        }

      }
    }
  }

  var $group = {
    $group: {
      _id: {
        _id: "$_id",
        user_id: "$user_id",
        name: "$name",
        createdAt: "$createdAt",
        date_initial: "$event.date_initial",
        date_end: "$event.date_end",
        event_id: "$event._id",
        description: "$event.description",
        name_event: "$event.name"
      },
      shared_user_id: {
        "$push": {
          "_id" : "$event.shared_user_id._id",
          "name" : "$event.shared_user_id.username"
        }
      }
    }
  }

  var $projectFinal = {
    $project: {
      _id: "$_id._id",
      user_id: "$_id.user_id",
      name: "$_id.name",
      createdAt: "$_id.createdAt",
      event: {
        date_initial: "$_id.date_initial",
        date_end: "$_id.date_end",
        _id: "$_id.event_id",
        description: "$_id.description",
        name: "$_id.name_event",
        shared_user_id: "$shared_user_id"
      }
    }
  }

  // Schedule.find({ user_id })
  //   .then(schedule => res.json({ schedule }))
  //   .catch(e => next(e));

  Schedule.aggregate([$match, unw, $lookup, unww, $project, $group, $projectFinal])
    .then(schedule => {
      console.log('Schendule: ', schedule)
      res.json({ schedule })
    })
    .catch(e => next(e));

  // db.schedules.aggregate([$match, unw, $lookup, unww, $project, $group, $projectFinal]).pretty()
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
  const { name, name_event, description, date_initial, date_end, shared_user_id } = req.body;

  // console.log('Entrou no update: ', _id);
  // console.log('Entrou no update user_id: ', user_id);
  console.log('Entrou no update body: ', shared_user_id);
  Schedule.update(
    { _id, user_id, 'event._id': id_event },
    {
      $set: {
        'event.$.name': name || name_event,
        'event.$.description': description,
        'event.$.date_initial': date_initial,
        'event.$.date_end': date_end,
        'event.$.shared_user_id': shared_user_id
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

function removeSchedule(req, res, next) {
  const { _id } = req.params;
  const { _id: user_id } = req.user;
  Schedule.remove(
      { _id, user_id },
    )
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));
}

function updateSchedule(req, res, next) {
  const { _id } = req.params;
  const { _id: user_id } = req.user;
  const { name } = req.body;
  console.log('req.body: ', req.body)

  Schedule.update(
      { _id, user_id },
      {
        $set: {
          name: name,
        }
      }
    )
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));
}

function removeUserEventShare (req, res, next) {
  const _id = objectId(req.params._id);
  const id_event = objectId(req.params.id_event);
  const user_id = objectId(req.user.user_id);
  console.log('req.user: ', req.user)
  console.log('req.boparamsdy: ', { user_id, 'event._id': id_event }, { $pull: { 'event.0.shared_user_id': _id } })
  Schedule.update(
    { user_id, 'event._id': id_event },
    { $pull: { event: { shared_user_id: _id } } }
  )
    .then(schedule => res.json({ schedule }))
    .catch(e => next(e));

}

// db.schedules.update(
//   {
//     "user_id": ObjectId("5ba261f35dc0463b3063135f"),
//     "event._id": ObjectId("5bd1cf7f3e9d2f285cf7f528")
//   },
//   {
//     $pull: {
//       "event.0.shared_user_id": ObjectId("5bd1a5154fd7c41a6002efcf")
//     }
//   }
// )

module.exports = {
  create,
  getMySchedule,
  updateScheduleNewEvent,
  remove,
  updateScheduleFromEvent,
  removeSchedule,
  updateSchedule,
  removeUserEventShare
};
