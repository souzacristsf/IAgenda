const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('./param-validation');
const scheduleCtrl = require('./schedule.controller');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/schedule - create new schedule of user */
router.route('/')
  .post(validate(paramValidation.create), scheduleCtrl.create);

router.route('/:user_id')
  .get(scheduleCtrl.getMySchedule);

module.exports = router;
